import { Link } from "@tanstack/react-router";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function SidebarHeader({ collapsed, onToggleCollapsed }: SidebarHeaderProps) {
  return (
    <div className="flex h-14 items-center border-b border-sidebar-border px-3">
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <Link
          to="/"
          className="truncate text-base font-semibold text-sidebar-foreground transition-colors hover:text-primary"
        >
          {!collapsed && "2D Canvas"}
        </Link>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapsed}
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-sidebar-foreground"
      >
        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </Button>
    </div>
  );
}
