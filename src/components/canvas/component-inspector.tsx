import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RESOURCE_TYPES, getResourceTypeConfig, type ResourceType } from "./resource-types";
import type { InfraNodeType, InfraNodeData, NodeStatus } from "./infrastructure-node";

const STATUS_CONFIG: Record<NodeStatus, { badge: string; label: string }> = {
  active: {
    badge: "bg-green-500/20 text-green-700 dark:text-green-400",
    label: "Active",
  },
  pending: {
    badge: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
    label: "Pending",
  },
  removed: {
    badge: "bg-red-500/20 text-red-700 dark:text-red-400",
    label: "Removed",
  },
  building: {
    badge: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
    label: "Building",
  },
  deploying: {
    badge: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
    label: "Deploying",
  },
  success: {
    badge: "bg-green-500/20 text-green-700 dark:text-green-400",
    label: "Success",
  },
  failed: {
    badge: "bg-red-500/20 text-red-700 dark:text-red-400",
    label: "Failed",
  },
};

const TYPE_COLORS: Record<ResourceType, string> = {
  "web-service": "text-blue-400",
  database: "text-purple-400",
  cache: "text-amber-400",
  queue: "text-green-400",
  cron: "text-orange-400",
  storage: "text-cyan-400",
};

interface ComponentInspectorProps {
  node: InfraNodeType | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, updates: Partial<InfraNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
}

export function ComponentInspector({ node, onClose, onUpdateNode, onDeleteNode }: ComponentInspectorProps) {
  if (!node) return null;

  const typeConfig = getResourceTypeConfig(node.data.type);
  const status = node.data.status ?? "active";
  const statusConfig = STATUS_CONFIG[status];
  const Icon = typeConfig?.icon;
  const createdAt = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "absolute inset-y-0 right-0 z-20 w-[300px] border-l bg-card shadow-lg",
        "animate-in slide-in-from-right-full duration-200",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 border-b p-4">
          {Icon && (
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted",
                TYPE_COLORS[node.data.type],
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Input
              value={node.data.name}
              onChange={(e) => onUpdateNode(node.id, { name: e.target.value })}
              className="h-8 text-sm font-medium"
            />
            <span className="text-xs text-muted-foreground">{typeConfig?.name ?? node.data.type}</span>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <span
              className={cn(
                "inline-flex w-fit items-center rounded px-2 py-1 text-xs font-medium",
                statusConfig.badge,
              )}
            >
              {statusConfig.label}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <select
              value={node.data.type}
              onChange={(e) => onUpdateNode(node.id, { type: e.target.value as ResourceType })}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              {RESOURCE_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Created</label>
            <span className="text-sm text-foreground">{createdAt}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto border-t p-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              onDeleteNode(node.id);
              onClose();
            }}
          >
            Delete Component
          </Button>
        </div>
      </div>
    </div>
  );
}
