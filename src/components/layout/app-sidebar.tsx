import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getProjects, getCurrentUser, resetStorage, createProject, deleteProject } from "@/api";
import type { Project, User } from "@/types";
import { cn } from "@/lib/utils";
import { SidebarHeader, ProjectsSection, UserSection } from "./sidebar";
import { toast } from "@/hooks/use-toast";

export function AppSidebar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getProjects(), getCurrentUser()]).then(([projectsData, userData]) => {
      setProjects(projectsData);
      setUser(userData);
      setLoading(false);
    });
  }, []);

  const handleReset = useCallback(async () => {
    resetStorage();
    const newProjects = await getProjects();
    setProjects(newProjects);
    navigate({ to: "/" });
    toast({ title: "Demo reset to initial state", variant: "default" });
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "r") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleReset]);

  const handleCreateProject = async (name: string) => {
    const project = await createProject(name);
    setProjects((prev) => [...prev, project]);
    navigate({ to: "/project/$projectId", params: { projectId: project.id } });
    toast({ title: `Created "${project.name}"`, variant: "success" });
  };

  const handleDeleteProject = async (projectId: string) => {
    const projectName = projects.find((p) => p.id === projectId)?.name;
    await deleteProject(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    navigate({ to: "/" });
    toast({ title: `Deleted "${projectName ?? "project"}"`, variant: "default" });
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[60px]" : "w-[260px]",
      )}
    >
      <SidebarHeader collapsed={collapsed} onToggleCollapsed={() => setCollapsed(!collapsed)} />

      <ProjectsSection
        collapsed={collapsed}
        loading={loading}
        projects={projects}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
      />

      <UserSection collapsed={collapsed} user={user} onReset={handleReset} />
    </aside>
  );
}
