import type { Edge } from "@xyflow/react";
import type { InfraNodeType } from "./infrastructure-node";

export interface CanvasState {
  nodes: InfraNodeType[];
  edges: Edge[];
}

export interface CanvasProps {
  projectId: string;
  environment: string;
}
