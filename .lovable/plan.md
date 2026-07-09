
# AI Workplace Productivity Assistant

A session-only, auth-free SaaS-style productivity app with three AI tools powered by Lovable AI (`openai/gpt-5.5` via the gateway). No database, no accounts, no persistence — all state lives in React memory and clears on refresh.

## Stack & Architecture

- **Frontend**: TanStack Start + React 19, Tailwind v4, shadcn components, AI Elements for chat UI.
- **AI backend**: Lovable AI Gateway. Enable `LOVABLE_API_KEY` secret. Two server surfaces:
  - `createServerFn` in `src/lib/ai.functions.ts` for one-shot generations (email, task plan).
  - Streaming server route `src/routes/api/chat.ts` for the chatbot (`useChat` + `DefaultChatTransport`).
- **State**: A single React context (`SessionProvider`) holds session counters, generated emails count, plans count, chat count, theme, default tone, language. Nothing persists — theme is intentionally session-only per spec.
- **No database, no Supabase, no auth.**

## Route Structure (`src/routes/`)

```
__root.tsx              → shell: sidebar + topbar layout, SessionProvider, HeadContent
index.tsx               → Dashboard
email.tsx               → Smart Email Generator
planner.tsx             → AI Task Planner
chat.tsx                → AI Workplace Chatbot
about.tsx               → About page
settings.tsx            → Session settings
help.tsx                → Help & FAQ
api/chat.ts             → streaming chat endpoint
```

Each route defines its own `head()` with unique title/description/OG tags.

## Layout

- **Sidebar** (shadcn `Sidebar`, `collapsible="icon"`): logo, links to Dashboard, Email Generator, Task Planner, Chatbot, About, Settings, Help. Active state via `useRouterState`.
- **Topbar**: SidebarTrigger, in-app search (filters nav links via Command palette), notifications bell (visual), theme toggle (light/dark via `.dark` class on `<html>`).
- **Footer / persistent banner**: Responsible AI disclaimer shown on every page (small bar at bottom).

## Feature 1 — Smart Email Generator (`/email`)

- **Input panel**: recipient, subject, purpose (textarea), notes (textarea), tone (Formal/Friendly/Persuasive segmented control), length (Short/Medium/Detailed).
- **Prompt preview card**: live-rendered structured prompt derived from inputs.
- **Output panel**: editable textarea/rich area with buttons Generate, Regenerate, Edit toggle, Copy, Download (.txt), Clear.
- Calls `generateEmail` server function → returns plain text email. Increments session email counter.

## Feature 2 — AI Task Planner (`/planner`)

- **Inputs**: work goals, tasks (add/remove list), meetings (time + title list), priority selector, working hours (start/end), plan type (Daily/Weekly).
- **Prompt preview**.
- **Output**: schedule as table (time, task, priority badge with color, duration, status).
  - Editable inline, drag-reorder via `@dnd-kit/sortable` (add dep).
  - Print (window.print with print CSS), Export (.csv + .json).
- Calls `generatePlan` server function returning structured JSON via AI SDK `Output.object` + zod schema. Increments session plan counter.

## Feature 3 — AI Workplace Chatbot (`/chat`)

- AI Elements: `Conversation`, `Message`, `MessageContent`, `MessageResponse`, `PromptInput`, `PromptInputTextarea`, `PromptInputFooter`, `PromptInputSubmit`, `Shimmer`.
- `useChat` with transport pointed at `/api/chat`.
- Suggested prompt chips above composer (7 examples from spec).
- User + AI avatars (generated brand mark for AI).
- Message actions: Copy, Regenerate (last), Edit user message, Clear chat.
- Attachment/mic icons rendered but disabled (visual only, tooltip "coming soon").
- Chat resets on refresh (in-memory only). Increments session chat counter on each user turn.

## Dashboard (`/`)

Tool cards for Email, Planner, Chatbot with CTA buttons routing to respective pages, plus session counters. Productivity Overview card grid: Emails generated, Plans created, Conversations, Estimated time saved (heuristic: emails×3min + plans×10min + chats×2min).

## About / Settings / Help

- **About**: static content — overview, features, benefits, responsible AI.
- **Settings**: theme toggle, default AI tone select (used as default in email generator), language select (visual, stores in context), "Reset Session" button that clears all counters + navigates home.
- **Help**: accordion FAQ, per-tool usage, responsible AI, troubleshooting.

## Design System

- Blue/purple/white palette encoded as oklch tokens in `src/styles.css` (primary blue, accent purple, gradient token `--gradient-primary`, soft shadow token `--shadow-elegant`). Dark mode variants defined.
- Rounded-2xl cards, generous spacing, subtle hover lift, smooth transitions.
- Custom SF-ish stack: use system font stack (no external font fetches needed).
- Root `head()` gets real title "AI Workplace Productivity Assistant" and description.

## Responsive

- Sidebar collapses to icon strip on tablet, offcanvas on mobile (shadcn default).
- Grid → single column on `< md`.
- Touch-friendly button sizes (min h-10).

## Session State Shape

```ts
type SessionState = {
  emailCount: number;
  planCount: number;
  chatCount: number;
  defaultTone: "Formal" | "Friendly" | "Persuasive";
  language: string;
  reset(): void;
};
```

## Technical Notes

- Enable Lovable AI: ensure `LOVABLE_API_KEY` via `ai_gateway--create`.
- Provider helper: `src/lib/ai-gateway.server.ts` per stack conventions.
- Email + planner server fns use `generateText` / `Output.object` with `openai/gpt-5.5`.
- Chat route streams with `streamText` + `toUIMessageStreamResponse`.
- Handle 429/402 gateway errors with toast messages.
- New deps: `@dnd-kit/core`, `@dnd-kit/sortable`, `react-markdown`, AI Elements components (`conversation message prompt-input shimmer`).

## Out of Scope (explicitly excluded per spec)

Auth, database, Supabase, history, saved chats, cloud sync, user profiles, cookies for auth.
