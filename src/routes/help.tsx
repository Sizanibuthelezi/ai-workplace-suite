import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — Workplace AI" },
      { name: "description", content: "FAQs and tips for using the AI workspace." },
      { property: "og:title", content: "Help & Support — Workplace AI" },
      { property: "og:description", content: "Get the most out of the AI workspace." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "Do I need to sign in?",
    a: "No. The app is fully accessible without registration or authentication.",
  },
  {
    q: "Where is my data stored?",
    a: "Nowhere. Generated content lives only in your browser session and is lost on refresh.",
  },
  {
    q: "How do I use the Smart Email Generator?",
    a: "Enter the recipient, subject, purpose, tone, and length. Click Generate to draft an email you can freely edit, copy, or download.",
  },
  {
    q: "How does the AI Task Planner work?",
    a: "Describe your goals, tasks, and meetings, choose Daily or Weekly, and generate a prioritized schedule you can reorder and edit.",
  },
  {
    q: "Can the chatbot remember past chats?",
    a: "No. Chats reset when the page refreshes to keep your data private.",
  },
  {
    q: "The AI is slow or errored out. What do I do?",
    a: "Check your connection and try again. Rate limits may apply during heavy use.",
  },
];

function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 md:px-6">
      <header className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-elegant">
          <LifeBuoy className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-sm text-muted-foreground">Answers, tips, and responsible-AI guidance.</p>
        </div>
      </header>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Responsible AI Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Always review AI-generated content before sending or acting on it.</p>
          <p>• Avoid sharing confidential or personally identifying information.</p>
          <p>• AI can make mistakes — verify facts, dates, and figures.</p>
          <p>• Use AI as an assistant, not a replacement for professional judgment.</p>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• If a response fails, wait a moment and try again.</p>
          <p>• Refresh the page to reset the current session.</p>
          <p>• Use a modern browser (Chrome, Edge, Safari, Firefox) for best results.</p>
        </CardContent>
      </Card>
    </div>
  );
}
