import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Tone = "Formal" | "Friendly" | "Persuasive";

type SessionState = {
  emailCount: number;
  planCount: number;
  chatCount: number;
  defaultTone: Tone;
  language: string;
  theme: "light" | "dark";
  incEmail: () => void;
  incPlan: () => void;
  incChat: () => void;
  setDefaultTone: (t: Tone) => void;
  setLanguage: (l: string) => void;
  toggleTheme: () => void;
  reset: () => void;
};

const Ctx = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [emailCount, setEmail] = useState(0);
  const [planCount, setPlan] = useState(0);
  const [chatCount, setChat] = useState(0);
  const [defaultTone, setDefaultTone] = useState<Tone>("Formal");
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const value: SessionState = {
    emailCount,
    planCount,
    chatCount,
    defaultTone,
    language,
    theme,
    incEmail: useCallback(() => setEmail((n) => n + 1), []),
    incPlan: useCallback(() => setPlan((n) => n + 1), []),
    incChat: useCallback(() => setChat((n) => n + 1), []),
    setDefaultTone,
    setLanguage,
    toggleTheme: useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []),
    reset: useCallback(() => {
      setEmail(0);
      setPlan(0);
      setChat(0);
    }, []),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession must be inside SessionProvider");
  return v;
}
