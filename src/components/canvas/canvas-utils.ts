import type { Edge } from "@xyflow/react";

const NODE_WIDTH = 192;
const NODE_HEIGHT = 60;
const NODE_PADDING = 20;
const MAX_PLACEMENT_ATTEMPTS = 100;

export function findNonOverlappingPosition(
  startX: number,
  startY: number,
  existingNodes: Array<{ position: { x: number; y: number } }>,
): { x: number; y: number } {
  let x = startX;
  let y = startY;
  let attempts = 0;

  const overlaps = (px: number, py: number) =>
    existingNodes.some((node) => {
      const nx = node.position.x;
      const ny = node.position.y;
      return (
        px < nx + NODE_WIDTH + NODE_PADDING &&
        px + NODE_WIDTH + NODE_PADDING > nx &&
        py < ny + NODE_HEIGHT + NODE_PADDING &&
        py + NODE_HEIGHT + NODE_PADDING > ny
      );
    });

  while (overlaps(x, y) && attempts < MAX_PLACEMENT_ATTEMPTS) {
    x += NODE_WIDTH + NODE_PADDING;
    if (attempts % 5 === 4) {
      x = startX;
      y += NODE_HEIGHT + NODE_PADDING;
    }
    attempts++;
  }

  return { x, y };
}

export function getUniqueName(baseName: string, existingNames: string[]): string {
  const existingSet = new Set(existingNames.map((n) => n.toLowerCase()));

  if (!existingSet.has(baseName.toLowerCase())) {
    return baseName;
  }

  const match = baseName.match(/^(.+?)-?(\d+)?$/);
  const prefix = match?.[1] ?? baseName;
  let counter = parseInt(match?.[2] ?? "1", 10);

  while (existingSet.has(`${prefix}-${counter}`.toLowerCase())) {
    counter++;
  }

  return `${prefix}-${counter}`;
}

export function edgeExists(edges: Edge[], source: string, target: string): boolean {
  return edges.some((e) => e.source === source && e.target === target);
}

export function generateEdgeId(source: string, target: string): string {
  return `e${source}-${target}-${Date.now()}`;
}

export function getViewportCenter(
  viewport: { x: number; y: number; zoom: number },
  offsetX: number = 400,
  offsetY: number = 200,
): { x: number; y: number } {
  return {
    x: (-viewport.x + offsetX) / viewport.zoom,
    y: (-viewport.y + offsetY) / viewport.zoom,
  };
}
