import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerFn } from "@tanstack/react-start";
import { generateEmail } from "@/lib/ai.functions";
import { useSession, type Tone } from "@/lib/session-context";
import { toast } from "sonner";
import { Copy, Download, Mail, RefreshCw, Sparkles, Trash2, Wand2 } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      { name: "description", content: "Generate professional workplace emails with AI." },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      { property: "og:description", content: "Draft polished emails in seconds." },
    ],
  }),
  component: EmailPage,
});

type Length = "Short" | "Medium" | "Detailed";

function EmailPage() {
  const { defaultTone, incEmail } = useSession();
  const call = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [tone, setTone] = useState<Tone>(defaultTone);
  const [length, setLength] = useState<Length>("Medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const promptPreview = useMemo(() => {
    if (!purpose && !subject) return "Fill in the fields to see the AI prompt preview.";
    return `Write a ${length.toLowerCase()} email to ${recipient || "the recipient"} about "${subject || "(subject)"}" with a ${tone.toLowerCase()} tone. Purpose: ${purpose || "(purpose)"}${notes ? `. Notes: ${notes}` : ""}.`;
  }, [recipient, subject, purpose, notes, tone, length]);

  const run = async () => {
    if (!recipient || !subject || !purpose) {
      toast.error("Please fill in recipient, subject, and purpose.");
      return;
    }
    setLoading(true);
    try {
      const res = await call({ data: { recipient, subject, purpose, notes, tone, length } });
      setOutput(res.email);
      incEmail();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to generate";
      if (msg.includes("429")) toast.error("Rate limit reached. Please try again shortly.");
      else if (msg.includes("402"))
        toast.error("AI credits exhausted. Add credits to continue.");
      else toast.error("Something went wrong generating the email.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${subject || "email"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <header className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-elegant">
          <Mail className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Smart Email Generator</h1>
          <p className="text-sm text-muted-foreground">
            Draft professional emails with AI in seconds.
          </p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Marketing Director"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Q3 marketing budget approval"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purpose">Purpose of Email</Label>
              <Textarea
                id="purpose"
                rows={3}
                placeholder="What do you want to communicate?"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                rows={2}
                placeholder="Optional context or specifics"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={(v) => setLength(v as Length)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short">Short</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
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
              {loading ? "Generating..." : output ? "Regenerate" : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Generated email</CardTitle>
            <div className="flex flex-wrap gap-1">
              <Button variant="ghost" size="sm" onClick={copy} disabled={!output}>
                <Copy className="mr-1 h-4 w-4" /> Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={download} disabled={!output}>
                <Download className="mr-1 h-4 w-4" /> Download
              </Button>
              <Button variant="ghost" size="sm" onClick={run} disabled={loading || !output}>
                <RefreshCw className="mr-1 h-4 w-4" /> Regenerate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOutput("")}
                disabled={!output}
              >
                <Trash2 className="mr-1 h-4 w-4" /> Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your AI-generated email will appear here. You can edit it freely."
              className="min-h-[420px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
