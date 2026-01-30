import type { Project } from "@/types";
import type { InfraNodeType } from "@/components/canvas/infrastructure-node";
import type { Edge } from "@xyflow/react";
import { mockProjects, projectSeedData } from "./mock-data";

const STORAGE_KEYS = {
  projects: "deploy2d-projects",
  nodes: "deploy2d-nodes",
  edges: "deploy2d-edges",
  initialized: "deploy2d-initialized",
} as const;

export interface CanvasData {
  nodes: InfraNodeType[];
  edges: Edge[];
}

function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

export function isInitialized(): boolean {
  return localStorage.getItem(STORAGE_KEYS.initialized) === "true";
}

export function initializeStorage(): void {
  if (isInitialized()) return;

  setItem(STORAGE_KEYS.projects, mockProjects);

  const allNodes: Record<string, InfraNodeType[]> = {};
  const allEdges: Record<string, Edge[]> = {};

  for (const [projectId, data] of Object.entries(projectSeedData)) {
    allNodes[projectId] = data.nodes;
    allEdges[projectId] = data.edges;
  }

  setItem(STORAGE_KEYS.nodes, allNodes);
  setItem(STORAGE_KEYS.edges, allEdges);

  localStorage.setItem(STORAGE_KEYS.initialized, "true");
}

export function loadProjects(): Project[] {
  initializeStorage();
  return getItem<Project[]>(STORAGE_KEYS.projects) ?? [];
}

export function saveProjects(projects: Project[]): void {
  setItem(STORAGE_KEYS.projects, projects);
}

export function loadProject(id: string): Project | null {
  const projects = loadProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export function saveProject(project: Project): void {
  const projects = loadProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index !== -1) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  saveProjects(projects);
}

export function removeProject(id: string): void {
  const projects = loadProjects().filter((p) => p.id !== id);
  saveProjects(projects);

  const allNodes = getItem<Record<string, InfraNodeType[]>>(STORAGE_KEYS.nodes) ?? {};
  const allEdges = getItem<Record<string, Edge[]>>(STORAGE_KEYS.edges) ?? {};

  delete allNodes[id];
  delete allEdges[id];

  setItem(STORAGE_KEYS.nodes, allNodes);
  setItem(STORAGE_KEYS.edges, allEdges);
}

const TRANSIENT_STATUSES = new Set(["building", "deploying"]);

function getStorageKey(projectId: string, environment?: string): string {
  return environment ? `${projectId}:${environment}` : projectId;
}

export function loadCanvasData(
  projectId: string,
  environment?: string,
  options?: { preserveTransient?: boolean },
): CanvasData {
  initializeStorage();

  const allNodes = getItem<Record<string, InfraNodeType[]>>(STORAGE_KEYS.nodes) ?? {};
  const allEdges = getItem<Record<string, Edge[]>>(STORAGE_KEYS.edges) ?? {};

  const key = getStorageKey(projectId, environment);
  const baseNodes = allNodes[projectId] ?? [];
  const baseEdges = allEdges[projectId] ?? [];
  const envNodes = environment ? allNodes[key] : undefined;
  const envEdges = environment ? allEdges[key] : undefined;

  const rawNodes = envNodes ?? baseNodes;

  const nodes = options?.preserveTransient
    ? rawNodes
    : rawNodes.map((node) => {
        if (node.data.status && TRANSIENT_STATUSES.has(node.data.status)) {
          return { ...node, data: { ...node.data, status: "pending" as const } };
        }
        return node;
      });

  return {
    nodes,
    edges: envEdges ?? baseEdges,
  };
}

export function saveCanvasData(projectId: string, data: CanvasData, environment?: string): void {
  const allNodes = getItem<Record<string, InfraNodeType[]>>(STORAGE_KEYS.nodes) ?? {};
  const allEdges = getItem<Record<string, Edge[]>>(STORAGE_KEYS.edges) ?? {};

  const key = getStorageKey(projectId, environment);
  allNodes[key] = data.nodes;
  allEdges[key] = data.edges;

  setItem(STORAGE_KEYS.nodes, allNodes);
  setItem(STORAGE_KEYS.edges, allEdges);
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEYS.projects);
  localStorage.removeItem(STORAGE_KEYS.nodes);
  localStorage.removeItem(STORAGE_KEYS.edges);
  localStorage.removeItem(STORAGE_KEYS.initialized);
}

export function resetStorage(): void {
  clearStorage();
  initializeStorage();
}
