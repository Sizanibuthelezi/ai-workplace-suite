import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/lib/session-context";
import ReactMarkdown from "react-markdown";
import {
  Copy,
  MessageSquare,
  Mic,
  Paperclip,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — Workplace AI" },
      { name: "description", content: "Chat with an AI assistant for workplace productivity." },
      { property: "og:title", content: "AI Workplace Chatbot — Workplace AI" },
      { property: "og:description", content: "An always-on AI assistant for professional tasks." },
    ],
  }),
  component: ChatPage,
});

const SUGGESTED = [
  "Write a leave request email.",
  "Plan my workday.",
  "Summarize meeting notes.",
  "Improve this email.",
  "Draft a project update.",
  "Create a meeting agenda.",
  "Prioritize today's tasks.",
];

function ChatPage() {
  const { incChat } = useSession();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => {
      const msg = e.message || "";
      if (msg.includes("429")) toast.error("Rate limit reached.");
      else if (msg.includes("402")) toast.error("AI credits exhausted.");
      else toast.error("Chat error. Please try again.");
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;
    sendMessage({ text: t });
    setInput("");
    incChat();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const clear = () => setMessages([]);

  const textOf = (m: (typeof messages)[number]) =>
    m.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("");

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] w-full max-w-4xl flex-col px-4 py-6 md:px-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-elegant">
            <MessageSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Workplace Chatbot</h1>
            <p className="text-sm text-muted-foreground">Your always-on productivity assistant.</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear}>
            <Trash2 className="mr-1 h-4 w-4" /> Clear Chat
          </Button>
        )}
      </header>

      <Card className="flex flex-1 flex-col overflow-hidden shadow-soft">
        <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-elegant">
                  <Sparkles className="h-7 w-7 text-primary-foreground" />
                </div>
                <h2 className="text-lg font-semibold">How can I help you today?</h2>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Ask me to draft emails, plan tasks, summarize notes, or anything else.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {SUGGESTED.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m, idx) => {
                  const isUser = m.role === "user";
                  const text = textOf(m);
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className={isUser ? "bg-secondary" : "gradient-primary text-primary-foreground"}>
                          {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`min-w-0 max-w-[85%] ${isUser ? "text-right" : ""}`}>
                        {isUser ? (
                          <div className="inline-block rounded-2xl bg-primary px-4 py-2 text-left text-primary-foreground shadow-soft">
                            <p className="whitespace-pre-wrap text-sm">{text}</p>
                          </div>
                        ) : (
                          <>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                              <ReactMarkdown>{text || "..."}</ReactMarkdown>
                            </div>
                            {text && (
                              <div className="mt-1 flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => {
                                    navigator.clipboard.writeText(text);
                                    toast.success("Copied");
                                  }}
                                >
                                  <Copy className="mr-1 h-3 w-3" /> Copy
                                </Button>
                                {idx === messages.length - 1 && !isLoading && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => regenerate()}
                                  >
                                    <RefreshCw className="mr-1 h-3 w-3" /> Regenerate
                                  </Button>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="gradient-primary text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t bg-background/50 p-3">
            <div className="flex items-end gap-2">
              <Button type="button" variant="ghost" size="icon" disabled title="Attachments coming soon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Message the AI assistant..."
                rows={1}
                className="min-h-10 resize-none"
              />
              <Button type="button" variant="ghost" size="icon" disabled title="Voice coming soon">
                <Mic className="h-4 w-4" />
              </Button>
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
