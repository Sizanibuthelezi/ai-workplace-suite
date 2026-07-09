import { Bell, Moon, Search, Sun } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSession } from "@/lib/session-context";

const routes: { label: string; path: string }[] = [
  { label: "Dashboard", path: "/" },
  { label: "Smart Email Generator", path: "/email" },
  { label: "AI Task Planner", path: "/planner" },
  { label: "AI Workplace Chatbot", path: "/chat" },
  { label: "About", path: "/about" },
  { label: "Settings", path: "/settings" },
  { label: "Help & Support", path: "/help" },
];

export function Topbar() {
  const { theme, toggleTheme } = useSession();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const matches = q ? routes.filter((r) => r.label.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
      <SidebarTrigger />
      <div className="relative ml-2 hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the app..."
          className="pl-9"
        />
        {matches.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 rounded-xl border bg-popover p-1 shadow-elegant">
            {matches.map((m) => (
              <button
                key={m.path}
                className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                onClick={() => {
                  setQ("");
                  navigate({ to: m.path });
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
