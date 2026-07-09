import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  CalendarClock,
  MessageSquare,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useSession } from "@/lib/session-context";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { emailCount, planCount, chatCount } = useSession();
  const timeSaved = emailCount * 3 + planCount * 10 + chatCount * 2;

  const tools = [
    {
      title: "Smart Email Generator",
      desc: "Generate professional workplace emails using AI.",
      icon: Mail,
      to: "/email",
      cta: "Generate Email",
      count: emailCount,
      label: "emails this session",
    },
    {
      title: "AI Task Planner",
      desc: "Create AI-generated daily or weekly work schedules.",
      icon: CalendarClock,
      to: "/planner",
      cta: "Create Plan",
      count: planCount,
      label: "plans this session",
    },
    {
      title: "AI Workplace Chatbot",
      desc: "Interactive AI workplace assistant for productivity support.",
      icon: MessageSquare,
      to: "/chat",
      cta: "Start Chat",
      count: chatCount,
      label: "conversations this session",
    },
  ];

  const stats = [
    { label: "Emails generated", value: emailCount, icon: Mail },
    { label: "Plans created", value: planCount, icon: CalendarClock },
    { label: "AI conversations", value: chatCount, icon: MessageSquare },
    { label: "Est. time saved", value: `${timeSaved}m`, icon: Clock },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 md:px-6">
      <section className="gradient-subtle rounded-2xl border p-6 shadow-soft md:p-8">
        <div className="flex items-center gap-2 text-sm text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">Welcome to your AI workspace</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          Automate workplace tasks with AI
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          Draft emails, plan your day, and chat with an AI assistant — all in one privacy-first
          workspace. No sign-in. No data stored.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Productivity Overview
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="shadow-soft">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-xl font-bold">{s.value}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          AI Tools
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((t) => (
            <Card
              key={t.title}
              className="group flex flex-col shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <CardHeader>
                <div className="mb-2 grid h-11 w-11 place-items-center rounded-xl gradient-primary shadow-elegant">
                  <t.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">{t.title}</CardTitle>
                <CardDescription>{t.desc}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{t.count}</span> {t.label}
                </div>
                <Button asChild className="w-full">
                  <Link to={t.to}>
                    {t.cta}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
