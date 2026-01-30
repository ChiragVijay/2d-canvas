import { ChevronDown, Rocket, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type Environment = "production" | "staging" | "development";

const environments: { id: Environment; label: string }[] = [
  { id: "production", label: "production" },
  { id: "staging", label: "staging" },
  { id: "development", label: "development" },
];

const STORAGE_KEY_PREFIX = "deploy2d-env-";

export function loadEnvironment(projectId: string): Environment {
  const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${projectId}`);
  if (saved && ["production", "staging", "development"].includes(saved)) {
    return saved as Environment;
  }
  return "production";
}

function saveEnvironment(projectId: string, env: Environment): void {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${projectId}`, env);
}

interface ProjectHeaderProps {
  projectId: string;
  projectName: string;
  environment: Environment;
  isDeploying?: boolean;
  onEnvironmentChange: (env: Environment) => void;
  onDeploy?: () => void;
  onCancel?: () => void;
}

export function ProjectHeader({
  projectId,
  projectName,
  environment,
  isDeploying = false,
  onEnvironmentChange,
  onDeploy,
  onCancel,
}: ProjectHeaderProps) {
  const handleEnvironmentChange = (env: Environment) => {
    saveEnvironment(projectId, env);
    onEnvironmentChange(env);
  };

  return (
    <div className="shrink-0 border-b border-border bg-card">
      <div className="flex h-12 items-center justify-between px-4">
        {/* Left: Project name + environment */}
        <div className="flex items-center gap-3">
          <h1 className="max-w-[200px] truncate text-sm font-medium text-foreground" title={projectName}>
            {projectName}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-28 items-center justify-between gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <span className="truncate">{environment}</span>
                <ChevronDown className="h-3 w-3 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {environments.map((env) => (
                <DropdownMenuItem
                  key={env.id}
                  onSelect={() => handleEnvironmentChange(env.id)}
                  className={cn(environment === env.id && "bg-accent")}
                >
                  {env.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: Deploy/Cancel button */}
        {isDeploying ? (
          <Button size="sm" variant="destructive" className="h-8 gap-1.5 text-xs" onClick={onCancel}>
            <Square className="h-3 w-3 fill-current" />
            Cancel
          </Button>
        ) : (
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={onDeploy}>
            <Rocket className="h-3.5 w-3.5" />
            Deploy All
          </Button>
        )}
      </div>
    </div>
  );
}
