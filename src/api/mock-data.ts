import type { Project } from "@/types";
import type { InfraNodeType } from "@/components/canvas/infrastructure-node";
import type { Edge } from "@xyflow/react";

export const mockUser = {
  id: "user-1",
  name: "User",
  email: "user@2d-canvas",
  avatar: null,
};

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "E-Commerce Platform",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-20T14:30:00Z",
  },
  {
    id: "proj-2",
    name: "API Backend",
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-01-18T11:00:00Z",
  },
  {
    id: "proj-3",
    name: "Data Pipeline",
    createdAt: "2025-01-05T08:00:00Z",
    updatedAt: "2025-01-19T16:45:00Z",
  },
];

const proj1Nodes: InfraNodeType[] = [
  {
    id: "proj1-web",
    type: "infrastructure",
    position: { x: 300, y: 0 },
    data: {
      name: "web-app",
      type: "web-service",
      status: "active",
    },
  },
  {
    id: "proj1-api",
    type: "infrastructure",
    position: { x: 550, y: 0 },
    data: {
      name: "api-server",
      type: "web-service",
      status: "active",
    },
  },
  {
    id: "proj1-postgres",
    type: "infrastructure",
    position: { x: 300, y: 180 },
    data: {
      name: "postgres-db",
      type: "database",
      status: "active",
    },
  },
  {
    id: "proj1-redis",
    type: "infrastructure",
    position: { x: 550, y: 180 },
    data: {
      name: "redis-cache",
      type: "cache",
      status: "active",
    },
  },
  {
    id: "proj1-storage",
    type: "infrastructure",
    position: { x: 100, y: 180 },
    data: {
      name: "postgres-volume",
      type: "storage",
      status: "active",
    },
  },
];

const proj1Edges: Edge[] = [
  { id: "proj1-e1", source: "proj1-web", target: "proj1-api" },
  { id: "proj1-e2", source: "proj1-api", target: "proj1-postgres" },
  { id: "proj1-e3", source: "proj1-api", target: "proj1-redis" },
  { id: "proj1-e4", source: "proj1-storage", target: "proj1-postgres" },
];

const proj2Nodes: InfraNodeType[] = [
  {
    id: "proj2-gateway",
    type: "infrastructure",
    position: { x: 350, y: 0 },
    data: {
      name: "api-gateway",
      type: "web-service",
      status: "active",
    },
  },
  {
    id: "proj2-auth",
    type: "infrastructure",
    position: { x: 150, y: 120 },
    data: {
      name: "auth-service",
      type: "web-service",
      status: "active",
    },
  },
  {
    id: "proj2-users",
    type: "infrastructure",
    position: { x: 350, y: 120 },
    data: {
      name: "users-service",
      type: "web-service",
      status: "pending",
    },
  },
  {
    id: "proj2-orders",
    type: "infrastructure",
    position: { x: 550, y: 120 },
    data: {
      name: "orders-service",
      type: "web-service",
      status: "active",
    },
  },
  {
    id: "proj2-postgres",
    type: "infrastructure",
    position: { x: 250, y: 280 },
    data: {
      name: "main-database",
      type: "database",
      status: "active",
    },
  },
  {
    id: "proj2-queue",
    type: "infrastructure",
    position: { x: 500, y: 280 },
    data: {
      name: "message-queue",
      type: "queue",
      status: "active",
    },
  },
  {
    id: "proj2-redis",
    type: "infrastructure",
    position: { x: 50, y: 280 },
    data: {
      name: "session-cache",
      type: "cache",
      status: "active",
    },
  },
];

const proj2Edges: Edge[] = [
  { id: "proj2-e1", source: "proj2-gateway", target: "proj2-auth" },
  { id: "proj2-e2", source: "proj2-gateway", target: "proj2-users" },
  { id: "proj2-e3", source: "proj2-gateway", target: "proj2-orders" },
  { id: "proj2-e4", source: "proj2-auth", target: "proj2-redis" },
  { id: "proj2-e5", source: "proj2-auth", target: "proj2-postgres" },
  { id: "proj2-e6", source: "proj2-users", target: "proj2-postgres" },
  { id: "proj2-e7", source: "proj2-orders", target: "proj2-postgres" },
  { id: "proj2-e8", source: "proj2-orders", target: "proj2-queue" },
];

const proj3Nodes: InfraNodeType[] = [
  {
    id: "proj3-ingest",
    type: "infrastructure",
    position: { x: 150, y: 0 },
    data: {
      name: "data-ingestion",
      type: "cron",
      status: "active",
    },
  },
  {
    id: "proj3-transform",
    type: "infrastructure",
    position: { x: 400, y: 0 },
    data: {
      name: "data-transform",
      type: "cron",
      status: "active",
    },
  },
  {
    id: "proj3-export",
    type: "infrastructure",
    position: { x: 650, y: 0 },
    data: {
      name: "data-export",
      type: "cron",
      status: "removed",
      subtitle: "Scheduled for removal",
    },
  },
  {
    id: "proj3-warehouse",
    type: "infrastructure",
    position: { x: 275, y: 150 },
    data: {
      name: "data-warehouse",
      type: "database",
      status: "active",
    },
  },
  {
    id: "proj3-raw-storage",
    type: "infrastructure",
    position: { x: 50, y: 150 },
    data: {
      name: "raw-data-bucket",
      type: "storage",
      status: "active",
    },
  },
  {
    id: "proj3-output-storage",
    type: "infrastructure",
    position: { x: 525, y: 150 },
    data: {
      name: "output-bucket",
      type: "storage",
      status: "pending",
    },
  },
  {
    id: "proj3-queue",
    type: "infrastructure",
    position: { x: 275, y: 300 },
    data: {
      name: "job-queue",
      type: "queue",
      status: "active",
    },
  },
];

const proj3Edges: Edge[] = [
  { id: "proj3-e1", source: "proj3-ingest", target: "proj3-raw-storage" },
  { id: "proj3-e2", source: "proj3-ingest", target: "proj3-warehouse" },
  { id: "proj3-e3", source: "proj3-transform", target: "proj3-warehouse" },
  { id: "proj3-e4", source: "proj3-export", target: "proj3-warehouse" },
  { id: "proj3-e5", source: "proj3-export", target: "proj3-output-storage" },
  { id: "proj3-e6", source: "proj3-warehouse", target: "proj3-queue" },
];

export const projectSeedData: Record<string, { nodes: InfraNodeType[]; edges: Edge[] }> = {
  "proj-1": { nodes: proj1Nodes, edges: proj1Edges },
  "proj-2": { nodes: proj2Nodes, edges: proj2Edges },
  "proj-3": { nodes: proj3Nodes, edges: proj3Edges },
};
