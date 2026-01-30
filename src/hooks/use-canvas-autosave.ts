import { useEffect, useRef } from "react";
import type { Edge } from "@xyflow/react";
import type { InfraNodeType } from "@/components/canvas/infrastructure-node";
import { saveCanvasData } from "@/api/storage";

export function useCanvasAutosave(
  projectId: string,
  environment: string,
  nodes: InfraNodeType[],
  edges: Edge[],
): void {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveCanvasData(projectId, { nodes, edges }, environment);
  }, [projectId, environment, nodes, edges]);
}
