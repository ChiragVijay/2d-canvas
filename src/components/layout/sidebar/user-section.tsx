import { Settings, LogOut, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "../theme-toggle";
import type { User } from "@/types";
import { cn } from "@/lib/utils";

interface UserSectionProps {
  collapsed: boolean;
  user: User | null;
  onReset: () => void;
}

export function UserSection({ collapsed, user, onReset }: UserSectionProps) {
  return (
    <div className="border-t border-sidebar-border p-2">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex flex-1 items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent",
                collapsed && "justify-center",
              )}
            >
              {user ? (
                <>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-sm font-medium text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {!collapsed && (
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={collapsed ? "center" : "start"} side="top" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Demo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!collapsed && <ThemeToggle />}
      </div>
    </div>
  );
}
