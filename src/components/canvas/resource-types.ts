import { Database, HardDrive, Clock, Box, Layers, Globe, type LucideIcon } from "lucide-react";
import type { InfraNodeData } from "./infrastructure-node";

export type ResourceType = InfraNodeData["type"];

export interface ResourceTypeConfig {
  id: ResourceType;
  name: string;
  description: string;
  icon: LucideIcon;
  defaultName: string;
}

export const RESOURCE_TYPES: ResourceTypeConfig[] = [
  {
    id: "web-service",
    name: "Web Service",
    description: "Deploy a web application or API",
    icon: Globe,
    defaultName: "web-service-1",
  },
  {
    id: "database",
    name: "Database",
    description: "PostgreSQL, MySQL, and more",
    icon: Database,
    defaultName: "postgres-1",
  },
  {
    id: "cache",
    name: "Redis / Cache",
    description: "In-memory caching layer",
    icon: Layers,
    defaultName: "redis-1",
  },
  {
    id: "storage",
    name: "Volume / Storage",
    description: "Persistent storage volume",
    icon: HardDrive,
    defaultName: "volume-1",
  },
  {
    id: "cron",
    name: "Cron Job",
    description: "Scheduled background tasks",
    icon: Clock,
    defaultName: "cron-1",
  },
  {
    id: "queue",
    name: "Queue / Worker",
    description: "Background job processing",
    icon: Box,
    defaultName: "worker-1",
  },
];

export function getResourceTypeConfig(id: ResourceType): ResourceTypeConfig | undefined {
  return RESOURCE_TYPES.find((t) => t.id === id);
}
