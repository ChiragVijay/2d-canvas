import type { NodeStatus } from "@/components/canvas/infrastructure-node";
import { loadCanvasData, saveCanvasData, loadProject } from "@/api/storage";
import { topologicalSort } from "./topological-sort";
import { sleep, randomBetween, isAbortError, pluralize } from "./async-utils";
import { toast } from "@/hooks/use-toast";

type DeploymentKey = string;
type Listener = () => void;

interface DeploymentContext {
  projectId: string;
  environment: string;
  controller: AbortController;
}

interface DeploymentResult {
  total: number;
  failed: number;
}

const TIMING = {
  BUILD_MIN_MS: 1500,
  BUILD_MAX_MS: 2500,
  DEPLOY_MIN_MS: 1000,
  DEPLOY_MAX_MS: 2000,
  BETWEEN_LEVELS_MS: 300,
  SUCCESS_RATE: 0.9,
} as const;

const TRANSIENT_STATUSES: NodeStatus[] = ["building", "deploying"];

function createKey(projectId: string, environment: string): DeploymentKey {
  return `${projectId}:${environment}`;
}

function updateNodeInCanvas(
  projectId: string,
  environment: string,
  nodeId: string,
  status: NodeStatus,
): void {
  const data = loadCanvasData(projectId, environment);
  const currentNode = data.nodes.find((node) => node.id === nodeId);
  if (!currentNode || currentNode.data.status === status) {
    return;
  }
  const updatedNodes = data.nodes.map((node) =>
    node.id === nodeId ? { ...node, data: { ...node.data, status } } : node,
  );
  saveCanvasData(projectId, { nodes: updatedNodes, edges: data.edges }, environment);
}

function resetTransientStatuses(projectId: string, environment: string): void {
  const data = loadCanvasData(projectId, environment);
  const resetNodes = data.nodes.map((node) =>
    node.data.status !== undefined && TRANSIENT_STATUSES.includes(node.data.status)
      ? { ...node, data: { ...node.data, status: "pending" as const } }
      : node,
  );
  saveCanvasData(projectId, { nodes: resetNodes, edges: data.edges }, environment);
}

function showDeploymentToast(projectId: string, environment: string, result: DeploymentResult): void {
  const { total, failed } = result;
  const project = loadProject(projectId);
  const projectName = project?.name ?? "Project";

  if (failed > 0) {
    toast({
      title: "Deployment completed with errors",
      description: `${projectName} (${environment}): ${failed} ${pluralize(failed, "component")} failed`,
      variant: "warning",
    });
  } else {
    toast({
      title: "Deployment successful",
      description: `${projectName} (${environment}): ${total} ${pluralize(total, "component")} deployed`,
      variant: "success",
    });
  }
}

async function deployLevel(
  ctx: DeploymentContext,
  nodeIds: string[],
  notify: () => void,
): Promise<NodeStatus[]> {
  const { projectId, environment, controller } = ctx;
  const results: NodeStatus[] = [];

  for (const id of nodeIds) {
    updateNodeInCanvas(projectId, environment, id, "building");
  }
  notify();
  await sleep(randomBetween(TIMING.BUILD_MIN_MS, TIMING.BUILD_MAX_MS), controller.signal);

  for (const id of nodeIds) {
    updateNodeInCanvas(projectId, environment, id, "deploying");
  }
  notify();
  await sleep(randomBetween(TIMING.DEPLOY_MIN_MS, TIMING.DEPLOY_MAX_MS), controller.signal);

  for (const id of nodeIds) {
    const status: NodeStatus = Math.random() < TIMING.SUCCESS_RATE ? "success" : "failed";
    updateNodeInCanvas(projectId, environment, id, status);
    results.push(status);
  }
  notify();

  await sleep(TIMING.BETWEEN_LEVELS_MS, controller.signal);

  return results;
}

async function runDeploymentPipeline(ctx: DeploymentContext, notify: () => void): Promise<DeploymentResult> {
  const { projectId, environment, controller } = ctx;
  const { nodes, edges } = loadCanvasData(projectId, environment);

  const deployableNodes = nodes.filter((n) => n.data.status !== "removed");
  const levels = topologicalSort(deployableNodes, edges);
  const allStatuses: NodeStatus[] = [];

  for (const level of levels) {
    if (controller.signal.aborted) break;
    const levelStatuses = await deployLevel(ctx, level, notify);
    allStatuses.push(...levelStatuses);
  }

  return {
    total: allStatuses.length,
    failed: allStatuses.filter((s) => s === "failed").length,
  };
}

class SubscriptionManager {
  private listeners = new Map<DeploymentKey, Set<Listener>>();

  subscribe(key: DeploymentKey, listener: Listener): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);

    return () => {
      const keyListeners = this.listeners.get(key);
      keyListeners?.delete(listener);
      if (keyListeners?.size === 0) {
        this.listeners.delete(key);
      }
    };
  }

  notify(key: DeploymentKey): void {
    const keyListeners = this.listeners.get(key);
    keyListeners?.forEach((listener) => listener());
  }
}

class DeploymentManager {
  private activeDeployments = new Map<DeploymentKey, DeploymentContext>();
  private subscriptions = new SubscriptionManager();

  isDeploying(projectId: string, environment: string): boolean {
    return this.activeDeployments.has(createKey(projectId, environment));
  }

  subscribe(projectId: string, environment: string, listener: Listener): () => void {
    return this.subscriptions.subscribe(createKey(projectId, environment), listener);
  }

  abort(projectId: string, environment: string): void {
    const key = createKey(projectId, environment);
    const ctx = this.activeDeployments.get(key);

    if (ctx) {
      ctx.controller.abort();
      this.activeDeployments.delete(key);
      this.subscriptions.notify(key);
    }
  }

  async deploy(projectId: string, environment: string): Promise<void> {
    const key = createKey(projectId, environment);

    this.abort(projectId, environment);

    const ctx: DeploymentContext = {
      projectId,
      environment,
      controller: new AbortController(),
    };

    this.activeDeployments.set(key, ctx);
    this.subscriptions.notify(key);

    const notify = () => this.subscriptions.notify(key);

    try {
      const result = await runDeploymentPipeline(ctx, notify);

      if (!ctx.controller.signal.aborted) {
        showDeploymentToast(projectId, environment, result);
      }
    } catch (error) {
      if (isAbortError(error)) {
        resetTransientStatuses(projectId, environment);
        notify();
        return;
      }
      throw error;
    } finally {
      if (this.activeDeployments.get(key)?.controller === ctx.controller) {
        this.activeDeployments.delete(key);
        notify();
      }
    }
  }
}

export const deploymentManager = new DeploymentManager();
