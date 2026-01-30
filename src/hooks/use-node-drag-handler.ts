import { useRef } from "react";
import { applyNodeChanges, type Edge, type NodeChange } from "@xyflow/react";
import type { InfraNodeType } from "@/components/canvas/infrastructure-node";
import { toast } from "@/hooks/use-toast";

export interface CanvasState {
  nodes: InfraNodeType[];
  edges: Edge[];
}

export function useNodeDragHandler(options: {
  nodes: InfraNodeType[];
  edges: Edge[];
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState | ((prev: CanvasState) => CanvasState)) => void;
  onNodesDeleted?: (deletedNodes: InfraNodeType[]) => void;
}): (changes: NodeChange<InfraNodeType>[]) => void {
  const { nodes, edges, canvasState, setCanvasState, onNodesDeleted } = options;

  const isDraggingRef = useRef(false);
  const dragStartStateRef = useRef<CanvasState | null>(null);

  const onNodesChange = (changes: NodeChange<InfraNodeType>[]) => {
    const isDragStart = changes.some((c) => c.type === "position" && c.dragging === true);
    const isDragEnd = changes.some((c) => c.type === "position" && c.dragging === false);

    if (isDragStart && !isDraggingRef.current) {
      isDraggingRef.current = true;
      dragStartStateRef.current = canvasState;
    }

    const newNodes = applyNodeChanges(changes, nodes);

    if (isDragEnd && isDraggingRef.current) {
      isDraggingRef.current = false;
      if (dragStartStateRef.current) {
        setCanvasState({ nodes: newNodes, edges });
      }
      dragStartStateRef.current = null;
    } else if (!isDraggingRef.current) {
      const removeChanges = changes.filter((c) => c.type === "remove");
      if (removeChanges.length > 0) {
        const deletedNodeIds = new Set(removeChanges.map((c) => (c as { id: string }).id));
        const deletedNodes = nodes.filter((n) => deletedNodeIds.has(n.id));

        if (deletedNodes.length > 0) {
          if (deletedNodes.length === 1) {
            toast({
              title: `Deleted ${deletedNodes[0].data.name}`,
              variant: "default",
            });
          } else {
            toast({
              title: `Deleted ${deletedNodes.length} components`,
              variant: "default",
            });
          }
          onNodesDeleted?.(deletedNodes);
        }

        const deletedIds = deletedNodes.map((n) => n.id);
        const filteredEdges = edges.filter(
          (e) => !deletedIds.includes(e.source) && !deletedIds.includes(e.target),
        );
        setCanvasState({ nodes: newNodes, edges: filteredEdges });
      } else {
        setCanvasState({ nodes: newNodes, edges });
      }
    } else {
      setCanvasState({ nodes: newNodes, edges });
    }
  };

  return onNodesChange;
}
