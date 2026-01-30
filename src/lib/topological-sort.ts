import type { Edge } from "@xyflow/react";

interface NodeLike {
  id: string;
}

export function topologicalSort<T extends NodeLike>(nodes: T[], edges: Edge[]): string[][] {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const graph = buildDependencyGraph(nodeIds, edges);

  return extractLevels(graph);
}

interface DependencyGraph {
  inDegree: Map<string, number>;
  adjacency: Map<string, string[]>;
}

function buildDependencyGraph(nodeIds: Set<string>, edges: Edge[]): DependencyGraph {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const id of nodeIds) {
    inDegree.set(id, 0);
    adjacency.set(id, []);
  }

  for (const { source, target } of edges) {
    if (nodeIds.has(source) && nodeIds.has(target)) {
      adjacency.get(source)!.push(target);
      inDegree.set(target, inDegree.get(target)! + 1);
    }
  }

  return { inDegree, adjacency };
}

function extractLevels(graph: DependencyGraph): string[][] {
  const { inDegree, adjacency } = graph;
  const levels: string[][] = [];

  let currentLevel = [...inDegree.entries()].filter(([, degree]) => degree === 0).map(([id]) => id);

  while (currentLevel.length > 0) {
    levels.push(currentLevel);

    const nextLevel: string[] = [];
    for (const id of currentLevel) {
      for (const neighbor of adjacency.get(id)!) {
        const newDegree = inDegree.get(neighbor)! - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) {
          nextLevel.push(neighbor);
        }
      }
    }
    currentLevel = nextLevel;
  }

  return levels;
}
