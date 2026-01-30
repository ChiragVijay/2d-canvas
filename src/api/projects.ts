import type { Project } from "@/types";
import {
  loadProjects,
  loadProject,
  saveProject,
  removeProject,
  loadCanvasData,
  saveCanvasData,
  type CanvasData,
} from "./storage";

export async function getProjects(): Promise<Project[]> {
  return loadProjects();
}

export async function getProject(id: string): Promise<Project | null> {
  return loadProject(id);
}

export async function createProject(name: string): Promise<Project> {
  const project: Project = {
    id: `proj-${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveProject(project);
  return project;
}

export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, "id" | "createdAt">>,
): Promise<Project | null> {
  const project = loadProject(id);
  if (!project) return null;

  const updated = {
    ...project,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveProject(updated);
  return updated;
}

export async function deleteProject(id: string): Promise<void> {
  removeProject(id);
}

export async function getCanvasData(projectId: string): Promise<CanvasData> {
  return loadCanvasData(projectId);
}

export async function setCanvasData(projectId: string, data: CanvasData): Promise<void> {
  saveCanvasData(projectId, data);
}
