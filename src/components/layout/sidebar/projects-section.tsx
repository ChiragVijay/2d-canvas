import { Loader2 } from "lucide-react";
import { CreateProjectDialog } from "../create-project-dialog";
import { ProjectNavItem } from "./project-nav-item";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  collapsed: boolean;
  loading: boolean;
  projects: Project[];
  onCreateProject: (name: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export function ProjectsSection({
  collapsed,
  loading,
  projects,
  onCreateProject,
  onDeleteProject,
}: ProjectsSectionProps) {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      {!collapsed && (
        <div className="mb-1 flex items-center justify-between px-2 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Projects
          </span>
          <CreateProjectDialog onCreateProject={onCreateProject} />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <nav className="space-y-0.5">
          {projects.map((project) => (
            <ProjectNavItem
              key={project.id}
              project={project}
              collapsed={collapsed}
              onDelete={() => onDeleteProject(project.id)}
            />
          ))}
        </nav>
      )}
    </div>
  );
}
