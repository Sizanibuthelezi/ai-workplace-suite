# AI Workplace Productivity Assistant

A modern, responsive SaaS-style web application that helps professionals automate workplace tasks using Artificial Intelligence. Built with privacy in mind — no registration, no sign-in, no data persistence. All state lives in browser memory and clears on refresh.

---

## Features Implemented

### Smart Email Generator
- Generate professional emails with AI by providing recipient, subject, purpose, and notes
- Choose tone: Formal, Friendly, or Persuasive
- Select length: Short, Medium, or Detailed
- Live prompt preview before generation
- Editable output with Copy, Download (.txt), Regenerate, and Clear actions

### AI Task Planner
- Create daily or weekly task schedules powered by AI
- Input work goals, individual tasks, meetings, priority level, and working hours
- Output rendered as an editable, drag-and-drop sortable table
- Export schedules to CSV or JSON, or print directly

### Interactive Workplace Chatbot
- Real-time streaming AI chat powered by GPT-5.5
- Suggested prompt chips for quick starts
- Message actions: Copy, Regenerate, Edit, and Clear chat
- Visual attachment and microphone icons (coming soon)

### Dashboard
- Overview of all three productivity tools with quick-access cards
- Session counters: Emails generated, Plans created, Conversations
- Estimated time saved heuristic

### Additional Pages
- **About** — App overview, features, and responsible AI commitment
- **Settings** — Theme toggle, default AI tone, language preference, and session reset
- **Help** — FAQ accordion, per-tool usage guides, and troubleshooting

### UI / UX
- Collapsible sidebar navigation with icon and full modes
- Global search via Command palette
- Light and dark themes
- Persistent Responsible AI disclaimer banner
- Fully responsive (desktop, tablet, mobile)

---

## Technologies and Tools Used

| Category | Technology |
|----------|-----------|
| Framework | [TanStack Start](https://tanstack.com/start) v1 + React 19 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| AI Backend | Lovable AI Gateway — `openai/gpt-5.5` |
| AI SDK | `ai` v5 + `@ai-sdk/react` v2 |
| Drag & Drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Markdown | `react-markdown` |
| Icons | `lucide-react` |
| Forms | `react-hook-form` + Zod |
| Notifications | `sonner` (toast) |
| Charts | `recharts` |
| Carousel | `embla-carousel-react` |
| Date Picker | `react-day-picker` |
| Build Tool | Vite 8 |
| Language | TypeScript 5.8 |
| Package Manager | Bun |
| Linting | ESLint + Prettier |

---

## Setup Instructions

### Prerequisites
- [Bun](https://bun.sh) installed (v1.1+)
- A `LOVABLE_API_KEY` environment variable for AI features

### 1. Clone and Install

```bash
git clone <repo-url>
cd <project-folder>
bun install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
LOVABLE_API_KEY=your_lovable_api_key_here
```

> The AI Gateway key is required for email generation, task planning, and chatbot streaming to function.

### 3. Run Development Server

```bash
bun run dev
```

The app will be available at `http://localhost:8080`.

### 4. Build for Production

```bash
bun run build
```

Preview the production build:

```bash
bun run preview
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start Vite dev server |
| `bun run build` | Build for production |
| `bun run build:dev` | Build in development mode |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |

---

## Project Structure

```
src/
  components/           # Reusable UI components (sidebar, topbar, banners)
  hooks/                # Custom React hooks
  lib/                  # AI gateway, session context, utilities
  routes/               # TanStack Start file-based routes
    __root.tsx          # Root layout (sidebar + topbar)
    index.tsx           # Dashboard
    email.tsx           # Smart Email Generator
    planner.tsx         # AI Task Planner
    chat.tsx            # Workplace Chatbot
    about.tsx           # About page
    settings.tsx        # Settings page
    help.tsx            # Help & FAQ
    api/chat.ts         # Streaming chat endpoint
  styles.css            # Global theme tokens (sky blue + dusty pink palette)
```

---

## Design System

- **Primary palette**: Sky blue and dusty pink
- **Color encoding**: OKLCH color space for perceptually uniform theming
- **Tokens**: CSS custom properties for light and dark modes
- **Border radius**: Generous rounded corners (`rounded-2xl` cards)
- **Typography**: System font stack (SF Pro-like aesthetic)
- **Shadows**: Soft elegant shadows via CSS custom properties

---

## Privacy & Security

- **No authentication** required — open to all users immediately
- **No database** — all data is session-only and clears on page refresh
- **No cookies** used for auth or tracking
- **No cloud sync** or user profiles
- **Responsible AI** disclaimer shown on every page
