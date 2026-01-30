import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <LayoutDashboard className="h-8 w-8 text-primary" />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-semibold text-foreground">Welcome to 2D Canvas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a project from the sidebar to open the canvas
        </p>
      </div>
      <div className="mt-6 max-w-sm rounded-lg border border-border bg-muted/50 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          All changes are saved to your browser's local storage. To reset the demo to its initial state, click
          your profile in the bottom-left corner and select <strong>Reset Demo</strong>.
        </p>
      </div>
    </div>
  );
}
