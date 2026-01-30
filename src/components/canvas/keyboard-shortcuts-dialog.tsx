import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
const cmdKey = isMac ? "⌘" : "Ctrl";

const shortcuts = [
  {
    category: "History",
    items: [
      { keys: [`${cmdKey}Z`], description: "Undo" },
      { keys: [`${cmdKey}⇧Z`], description: "Redo" },
    ],
  },
  {
    category: "Canvas",
    items: [
      { keys: ["Scroll"], description: "Zoom in/out" },
      { keys: ["Drag"], description: "Pan canvas" },
    ],
  },
  {
    category: "Selection",
    items: [
      { keys: ["Click"], description: "Select node or edge" },
      { keys: ["Delete", "Backspace"], description: "Delete selected" },
    ],
  },
  {
    category: "Connections",
    items: [{ keys: ["Drag handle"], description: "Create connection" }],
  },
  {
    category: "Demo",
    items: [{ keys: [`${cmdKey}⇧R`], description: "Reset demo to initial state" }],
  },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Keyboard shortcuts (?)">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            View all available keyboard shortcuts for navigating and editing
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div key={item.description} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{item.description}</span>
                    <div className="flex gap-1">
                      {item.keys.map((key, i) => (
                        <span key={key} className="flex items-center gap-1">
                          {i > 0 && <span className="text-xs text-muted-foreground">/</span>}
                          <Kbd>{key}</Kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press <Kbd>?</Kbd> to toggle this dialog
        </p>
      </DialogContent>
    </Dialog>
  );
}
