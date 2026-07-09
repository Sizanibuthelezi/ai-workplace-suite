import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerFn } from "@tanstack/react-start";
import { generatePlan } from "@/lib/ai.functions";
import { useSession } from "@/lib/session-context";
import { toast } from "sonner";
import {
  CalendarClock,
  Download,
  GripVertical,
  Printer,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      { name: "description", content: "Create AI-generated daily and weekly work schedules." },
      { property: "og:title", content: "AI Task Planner — Workplace AI" },
      { property: "og:description", content: "Plan your workday with AI-powered scheduling." },
    ],
  }),
  component: PlannerPage,
});

type Priority = "High" | "Medium" | "Low";
type PlanItem = {
  id: string;
  time: string;
  task: string;
  priority: Priority;
  duration: string;
  status: string;
};

function priorityColor(p: string) {
  if (p === "High") return "bg-[var(--color-priority-high)]/15 text-[var(--color-priority-high)] border-[var(--color-priority-high)]/30";
  if (p === "Medium") return "bg-[var(--color-priority-medium)]/15 text-[var(--color-priority-medium)] border-[var(--color-priority-medium)]/30";
  return "bg-[var(--color-priority-low)]/15 text-[var(--color-priority-low)] border-[var(--color-priority-low)]/30";
}

function PlannerPage() {
  const { incPlan } = useSession();
  const call = useServerFn(generatePlan);
  const [goals, setGoals] = useState("");
  const [tasks, setTasks] = useState("");
  const [meetings, setMeetings] = useState("");
  const [priority, setPriority] = useState<Priority>("High");
  const [workStart, setWorkStart] = useState("09:00");
  const [workEnd, setWorkEnd] = useState("17:30");
  const [planType, setPlanType] = useState<"Daily" | "Weekly">("Daily");
  const [items, setItems] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const promptPreview = useMemo(() => {
    if (!tasks && !goals) return "Fill in tasks or goals to see the AI prompt preview.";
    return `Generate a prioritized ${planType.toLowerCase()} schedule from ${workStart} to ${workEnd} focused on ${priority} priority work. Goals: ${goals || "(none)"}. Tasks: ${tasks || "(none)"}. Meetings: ${meetings || "(none)"}. Include realistic time blocks and short breaks.`;
  }, [goals, tasks, meetings, priority, workStart, workEnd, planType]);

  const run = async () => {
    if (!tasks && !goals) {
      toast.error("Add goals or tasks first.");
      return;
    }
    setLoading(true);
    try {
      const res = await call({
        data: { goals, tasks, meetings, priority, workStart, workEnd, planType },
      });
      setItems(
        res.items.map((i, idx) => ({ ...i, id: `${Date.now()}-${idx}` })),
      );
      incPlan();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("429")) toast.error("Rate limit reached. Please try again shortly.");
      else if (msg.includes("402")) toast.error("AI credits exhausted.");
      else toast.error("Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setItems((arr) => {
      const oldIdx = arr.findIndex((i) => i.id === active.id);
      const newIdx = arr.findIndex((i) => i.id === over.id);
      return arrayMove(arr, oldIdx, newIdx);
    });
  };

  const update = (id: string, patch: Partial<PlanItem>) =>
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const remove = (id: string) => setItems((arr) => arr.filter((i) => i.id !== id));

  const exportCsv = () => {
    const csv = [
      ["Time", "Task", "Priority", "Duration", "Status"],
      ...items.map((i) => [i.time, i.task, i.priority, i.duration, i.status]),
    ]
      .map((row) => row.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${planType.toLowerCase()}-plan.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <header className="mb-6 flex items-center gap-3 no-print">
        <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-elegant">
          <CalendarClock className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Task Planner</h1>
          <p className="text-sm text-muted-foreground">Build a prioritized daily or weekly plan.</p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card className="shadow-soft no-print">
          <CardHeader>
            <CardTitle className="text-base">Plan inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Plan type</Label>
              <Select value={planType} onValueChange={(v) => setPlanType(v as "Daily" | "Weekly")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily Plan</SelectItem>
                  <SelectItem value="Weekly">Weekly Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goals">Work goals</Label>
              <Textarea id="goals" rows={2} value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="Top objectives" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tasks">Task list</Label>
              <Textarea id="tasks" rows={4} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder="One task per line" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meetings">Meeting schedule</Label>
              <Textarea id="meetings" rows={2} value={meetings} onChange={(e) => setMeetings(e.target.value)} placeholder="e.g. 10:00 Standup, 14:00 Client sync" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Priority focus</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label>Start</Label>
                  <Input type="time" value={workStart} onChange={(e) => setWorkStart(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>End</Label>
                  <Input type="time" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3">
              <div className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> AI Prompt Preview
              </div>
              <p className="text-sm">{promptPreview}</p>
            </div>

            <Button onClick={run} disabled={loading} className="w-full">
              <Wand2 className="mr-1 h-4 w-4" />
              {loading ? "Generating..." : items.length ? "Regenerate Plan" : "Generate Plan"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex-row items-center justify-between gap-2 no-print">
            <CardTitle className="text-base">Your schedule</CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => window.print()} disabled={!items.length}>
                <Printer className="mr-1 h-4 w-4" /> Print
              </Button>
              <Button variant="ghost" size="sm" onClick={exportCsv} disabled={!items.length}>
                <Download className="mr-1 h-4 w-4" /> Export
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setItems([])} disabled={!items.length}>
                <Trash2 className="mr-1 h-4 w-4" /> Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                Your AI-generated schedule will appear here.
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {items.map((i) => (
                      <SortableRow key={i.id} item={i} onChange={update} onRemove={remove} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SortableRow({
  item,
  onChange,
  onRemove,
}: {
  item: PlanItem;
  onChange: (id: string, patch: Partial<PlanItem>) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[auto_110px_1fr_auto_auto] items-center gap-2 rounded-lg border bg-card p-2"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab rounded p-1 text-muted-foreground hover:bg-muted no-print"
        aria-label="Drag"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Input
        className="h-8 text-xs"
        value={item.time}
        onChange={(e) => onChange(item.id, { time: e.target.value })}
      />
      <Input
        className="h-8 text-sm"
        value={item.task}
        onChange={(e) => onChange(item.id, { task: e.target.value })}
      />
      <Badge variant="outline" className={`${priorityColor(item.priority)} border`}>
        {item.priority}
      </Badge>
      <div className="flex items-center gap-1">
        <span className="hidden text-xs text-muted-foreground md:inline">{item.duration}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 no-print"
          onClick={() => onRemove(item.id)}
          aria-label="Remove"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
