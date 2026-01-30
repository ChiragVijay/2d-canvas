import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProjectCanvas } from "@/components/canvas";
import { ProjectHeader, loadEnvironment, type Environment } from "@/components/layout/project-header";
import { getProject } from "@/api";
import { useDeployment } from "@/hooks/use-deployment";
import type { Project } from "@/types";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/project/$projectId")({
  component: ProjectPage,
});

function ProjectPage() {
  const { projectId } = Route.useParams();
  return <ProjectPageContent key={projectId} projectId={projectId} />;
}

function ProjectPageContent({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [environment, setEnvironment] = useState<Environment>(() => loadEnvironment(projectId));

  const { isDeploying, deploy, abort } = useDeployment(projectId, environment);

  useEffect(() => {
    let cancelled = false;
    getProject(projectId).then((data) => {
      if (cancelled) return;
      setProject(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader
        projectId={projectId}
        projectName={project.name}
        environment={environment}
        isDeploying={isDeploying}
        onEnvironmentChange={setEnvironment}
        onDeploy={deploy}
        onCancel={abort}
      />
      <div className="flex-1">
        <ProjectCanvas key={`${projectId}:${environment}`} projectId={projectId} environment={environment} />
      </div>
    </div>
  );
}
