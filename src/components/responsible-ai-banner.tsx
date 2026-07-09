import { ShieldAlert } from "lucide-react";

export function ResponsibleAiBanner() {
  return (
    <div className="border-t bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-6xl items-start gap-2">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>
          <span className="font-medium text-foreground">Responsible AI Notice:</span> AI-generated
          content is intended to assist and may not always be accurate or appropriate. Always
          review and edit before use in professional environments.
        </p>
      </div>
    </div>
  );
}
