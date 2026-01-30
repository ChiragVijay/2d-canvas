import { Undo2, Redo2, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface CanvasToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

function ToolbarButton({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center border-b border-border text-foreground/70 transition-colors last:border-b-0",
        disabled ? "cursor-not-allowed opacity-30" : "hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function CanvasToolbar({ canUndo, canRedo, onUndo, onRedo }: CanvasToolbarProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card/80 shadow-md backdrop-blur-sm">
      <ToolbarButton onClick={onUndo} disabled={!canUndo} title="Undo (⌘Z)">
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={onRedo} disabled={!canRedo} title="Redo (⌘⇧Z)">
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
      <div className="my-1 border-t border-border" />
      <ToolbarButton onClick={zoomIn} title="Zoom in">
        <ZoomIn className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={zoomOut} title="Zoom out">
        <ZoomOut className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => fitView({ padding: 0.3, duration: 400, maxZoom: 1.25 })} title="Fit view">
        <Maximize className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}
