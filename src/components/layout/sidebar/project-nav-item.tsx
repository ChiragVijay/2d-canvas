import { Link } from "@tanstack/react-router";
import { FolderKanban, MoreHorizontal, Trash2 } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProjectNavItemProps {
  project: Project;
  collapsed: boolean;
  onDelete: () => void;
}

export function ProjectNavItem({ project, collapsed, onDelete }: ProjectNavItemProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center rounded-lg transition-all duration-150 hover:bg-sidebar-accent",
        collapsed && "justify-center",
      )}
    >
      <Link
        to="/project/$projectId"
        params={{ projectId: project.id }}
        className={cn(
          "flex flex-1 items-center gap-3 px-2.5 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:text-sidebar-foreground",
          collapsed && "justify-center px-2",
        )}
      >
        <FolderKanban className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        {!collapsed && <span className="truncate">{project.name}</span>}
      </Link>

      {!collapsed && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right">
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
