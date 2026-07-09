import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Info, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Workplace AI" },
      { name: "description", content: "Learn about the AI Workplace Productivity Assistant." },
      { property: "og:title", content: "About — Workplace AI" },
      { property: "og:description", content: "Privacy-first AI productivity for professionals." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 md:px-6">
      <header className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-elegant">
          <Info className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">About</h1>
          <p className="text-sm text-muted-foreground">What this app does and why.</p>
        </div>
      </header>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">AI Workplace Productivity Assistant</span>{" "}
            helps professionals automate everyday workplace tasks using AI. Draft polished emails,
            build a prioritized daily or weekly plan, and chat with an assistant for on-demand help
            — all without an account and without storing any data.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Features
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3 text-sm">
          <Feature title="Smart Email Generator" desc="Draft professional emails with tone and length controls." />
          <Feature title="AI Task Planner" desc="Generate structured schedules with priorities and time blocks." />
          <Feature title="AI Workplace Chatbot" desc="A conversational assistant for productivity questions." />
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            <li>• Increased productivity</li>
            <li>• Better organization</li>
            <li>• Time savings on routine writing</li>
            <li>• Professional communication</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> Responsible AI
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          AI-generated content is a starting point — not a final product. Always review, verify,
          and edit emails, schedules, and assistant responses before using them in professional or
          business environments. Do not share confidential information you would not send through a
          third-party AI service.
        </CardContent>
      </Card>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}
