import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSession, type Tone } from "@/lib/session-context";
import { RotateCcw, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workplace AI" },
      { name: "description", content: "Session settings for the AI workspace." },
      { property: "og:title", content: "Settings — Workplace AI" },
      { property: "og:description", content: "Manage session-only preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const {
    theme,
    toggleTheme,
    defaultTone,
    setDefaultTone,
    language,
    setLanguage,
    reset,
  } = useSession();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 md:px-6">
      <header className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-elegant">
          <SettingsIcon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            These preferences apply only to your current session.
          </p>
        </div>
      </header>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Dark mode</Label>
            <p className="text-xs text-muted-foreground">Toggle light or dark theme.</p>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">AI defaults</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Default email tone</Label>
            <Select value={defaultTone} onValueChange={(v) => setDefaultTone(v as Tone)}>
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
            <Label>Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["English", "Spanish", "French", "German", "Portuguese", "Japanese"].map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Session</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Reset session</Label>
            <p className="text-xs text-muted-foreground">Clear session counters and stats.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              reset();
              toast.success("Session reset.");
            }}
          >
            <RotateCcw className="mr-1 h-4 w-4" /> Reset
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
