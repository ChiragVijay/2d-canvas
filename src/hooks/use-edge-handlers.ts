import { addEdge, applyEdgeChanges, type Connection, type Edge, type EdgeChange } from "@xyflow/react";
import type { InfraNodeType } from "@/components/canvas/infrastructure-node";
import { toast } from "@/hooks/use-toast";

export interface CanvasState {
  nodes: InfraNodeType[];
  edges: Edge[];
}

function edgeExists(edges: Edge[], connection: Connection): boolean {
  return edges.some((e) => e.source === connection.source && e.target === connection.target);
}

function generateEdgeId(connection: Connection): string {
  return `e${connection.source}-${connection.target}-${Date.now()}`;
}

export function useEdgeHandlers(options: {
  nodes: InfraNodeType[];
  edges: Edge[];
  setCanvasState: (state: CanvasState | ((prev: CanvasState) => CanvasState)) => void;
}): {
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
  onConnect: (connection: Connection) => void;
} {
  const { nodes, edges, setCanvasState } = options;

  const onEdgesChange = (changes: EdgeChange<Edge>[]) => {
    const removeChanges = changes.filter((c) => c.type === "remove");
    if (removeChanges.length > 0) {
      const count = removeChanges.length;
      toast({
        title: count === 1 ? "Deleted connection" : `Deleted ${count} connections`,
        variant: "default",
      });
    }

    const newEdges = applyEdgeChanges(changes, edges);
    setCanvasState({ nodes, edges: newEdges });
  };

  const onConnect = (connection: Connection) => {
    if (edgeExists(edges, connection)) return;

    const newEdges = addEdge(
      {
        ...connection,
        id: generateEdgeId(connection),
      },
      edges,
    );
    setCanvasState({ nodes, edges: newEdges });
  };

  return { onEdgesChange, onConnect };
}
