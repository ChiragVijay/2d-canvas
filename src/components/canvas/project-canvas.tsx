import { useMemo, useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  useOnSelectionChange,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { InfraNode, type InfraNodeType, type InfraNodeData } from "./infrastructure-node";
import { ComponentInspector } from "./component-inspector";
import { ConnectionEdge } from "./connection-edge";
import { CreateResourceDialog, type ResourceType } from "./create-resource-dialog";
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog";
import { CanvasToolbar } from "./canvas-toolbar";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import { loadCanvasData } from "@/api/storage";
import { deploymentManager } from "@/lib/deployment-manager";
import type { CanvasState, CanvasProps } from "./canvas-types";
import { findNonOverlappingPosition, getUniqueName, getViewportCenter } from "./canvas-utils";
import { useCanvasAutosave } from "@/hooks/use-canvas-autosave";
import { useUndoRedoHotkeys } from "@/hooks/use-undo-redo-hotkeys";
import { useNodeDragHandler } from "@/hooks/use-node-drag-handler";
import { useEdgeHandlers } from "@/hooks/use-edge-handlers";
import { toast } from "@/hooks/use-toast";

const defaultViewport = { x: 0, y: 0, zoom: 1 };

const defaultEdgeOptions = {
  type: "smoothstep",
  animated: true,
  style: { strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 16,
    height: 16,
  },
};

function CanvasInner({ projectId, environment }: CanvasProps) {
  const loadDeploymentAwareData = useCallback(
    () =>
      loadCanvasData(projectId, environment, {
        preserveTransient: deploymentManager.isDeploying(projectId, environment),
      }),
    [projectId, environment],
  );

  const initialData = useMemo(() => loadDeploymentAwareData(), [loadDeploymentAwareData]);
  const {
    state: canvasState,
    set: setCanvasState,
    replace: replaceCanvasState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<CanvasState>(initialData);

  const { nodes, edges } = canvasState;

  useEffect(() => {
    const unsubscribe = deploymentManager.subscribe(projectId, environment, () => {
      replaceCanvasState(loadDeploymentAwareData());
    });
    return unsubscribe;
  }, [projectId, environment, replaceCanvasState, loadDeploymentAwareData]);

  useCanvasAutosave(projectId, environment, nodes, edges);

  const [selectedNode, setSelectedNode] = useState<InfraNodeType | null>(null);

  useOnSelectionChange({
    onChange: ({ nodes: selectedNodes }: { nodes: InfraNodeType[] }) => {
      setSelectedNode(selectedNodes.length === 1 ? (selectedNodes[0] as InfraNodeType) : null);
    },
  });

  const nodeTypes: NodeTypes = useMemo(() => ({ infrastructure: InfraNode }), []);
  const edgeTypes = useMemo(() => ({ default: ConnectionEdge }), []);
  const { getViewport } = useReactFlow();

  useUndoRedoHotkeys({ undo, redo });

  const onNodesChange = useNodeDragHandler({
    nodes,
    edges,
    canvasState,
    setCanvasState,
    onNodesDeleted: (deletedNodes) => {
      if (selectedNode && deletedNodes.some((n) => n.id === selectedNode.id)) {
        setSelectedNode(null);
      }
    },
  });

  const { onEdgesChange, onConnect } = useEdgeHandlers({
    nodes,
    edges,
    setCanvasState,
  });

  const handleCreateResource = (type: ResourceType, name: string) => {
    const viewport = getViewport();
    const center = getViewportCenter(viewport);
    const position = findNonOverlappingPosition(center.x, center.y, nodes);
    const uniqueName = getUniqueName(
      name,
      nodes.map((n) => n.data.name),
    );

    const newNode: InfraNodeType = {
      id: `node-${Date.now()}`,
      type: "infrastructure",
      position,
      data: {
        name: uniqueName,
        type,
        status: "pending",
      },
    };

    setCanvasState({ nodes: [...nodes, newNode], edges });
    toast({ title: `Created ${uniqueName}`, variant: "success" });
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<InfraNodeData>) => {
    setCanvasState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n)),
    }));
    if (selectedNode?.id === nodeId) {
      setSelectedNode((prev: InfraNodeType | null) =>
        prev ? { ...prev, data: { ...prev.data, ...updates } } : null,
      );
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    const nodeName = nodes.find((n) => n.id === nodeId)?.data.name;
    setCanvasState((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((n) => n.id !== nodeId),
      edges: prev.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    }));
    setSelectedNode(null);
    toast({ title: `Deleted ${nodeName ?? "component"}`, variant: "default" });
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute left-4 top-4 z-10 flex gap-2">
        <KeyboardShortcutsDialog />
      </div>
      <div className="absolute right-4 top-4 z-10">
        <CreateResourceDialog onCreateResource={handleCreateResource} />
      </div>
      <div className="absolute bottom-4 left-4 z-10">
        <CanvasToolbar canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo} />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={defaultEdgeOptions}
        defaultViewport={defaultViewport}
        minZoom={0.1}
        maxZoom={2}
        fitView
        fitViewOptions={{ padding: 0.3, duration: 0, maxZoom: 1.25 }}
        zoomOnScroll
        zoomOnPinch
        selectionOnDrag
        panOnDrag={[1, 2]}
        selectNodesOnDrag={false}
        deleteKeyCode={["Backspace", "Delete"]}
        proOptions={{ hideAttribution: true }}
        className="bg-background [&_.react-flow__edge-path]:!stroke-muted-foreground [&_.react-flow__edge.selected_.react-flow__edge-path]:!stroke-primary [&_.react-flow__arrowhead>polyline]:!fill-muted-foreground [&_.react-flow__arrowhead>polyline]:!stroke-muted-foreground [&_.react-flow__edge.selected_.react-flow__arrowhead>polyline]:!fill-primary [&_.react-flow__edge.selected_.react-flow__arrowhead>polyline]:!stroke-primary"
        style={{ cursor: "grab" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          className="!bg-background"
          color="oklch(0.5 0.01 90 / 0.4)"
        />
      </ReactFlow>
      <ComponentInspector
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
      />
    </div>
  );
}

export function ProjectCanvas({ projectId, environment }: CanvasProps) {
  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <CanvasInner key={`${projectId}:${environment}`} projectId={projectId} environment={environment} />
      </ReactFlowProvider>
    </div>
  );
}
