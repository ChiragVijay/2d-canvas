import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Globe, Database, HardDrive, Clock, Box, Layers, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type NodeStatus = "active" | "pending" | "removed" | "building" | "deploying" | "success" | "failed";

export type InfraNodeData = {
  name: string;
  type: "web-service" | "database" | "cache" | "queue" | "cron" | "storage";
  status?: NodeStatus;
  subtitle?: string;
};

export type InfraNodeType = Node<InfraNodeData, "infrastructure">;

const TYPE_CONFIG = {
  "web-service": { icon: Globe, color: "text-blue-400" },
  database: { icon: Database, color: "text-purple-400" },
  cache: { icon: Layers, color: "text-amber-400" },
  queue: { icon: Box, color: "text-green-400" },
  cron: { icon: Clock, color: "text-orange-400" },
  storage: { icon: HardDrive, color: "text-cyan-400" },
} as const;

const STATUS_CONFIG = {
  active: {
    badge: "bg-green-500/20 text-green-700 dark:text-green-400",
    border: "border-green-500/30",
    label: "active",
  },
  pending: {
    badge: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
    border: "border-amber-500/50",
    label: "pending",
  },
  removed: {
    badge: "bg-red-500/20 text-red-700 dark:text-red-400",
    border: "border-red-500/50",
    label: "removed",
  },
  building: {
    badge: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
    border: "border-blue-500/50",
    label: "building",
  },
  deploying: {
    badge: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
    border: "border-purple-500/50",
    label: "deploying",
  },
  success: {
    badge: "bg-green-500/20 text-green-700 dark:text-green-400",
    border: "border-green-500/30",
    label: "success",
  },
  failed: {
    badge: "bg-red-500/20 text-red-700 dark:text-red-400",
    border: "border-red-500/50",
    label: "failed",
  },
} as const;

function StatusIcon({ status }: { status: NodeStatus }) {
  if (status === "building" || status === "deploying") {
    return <Loader2 className="h-3 w-3 animate-spin" />;
  }
  if (status === "success") {
    return <CheckCircle2 className="h-3 w-3" />;
  }
  if (status === "failed") {
    return <XCircle className="h-3 w-3" />;
  }
  return null;
}

function InfraNodeComponent({ data, selected }: NodeProps<InfraNodeType>) {
  const { icon: Icon, color } = TYPE_CONFIG[data.type];
  const status = data.status ?? "active";
  const { badge, border, label } = STATUS_CONFIG[status];

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="h-2.5 w-2.5 border-2 border-card bg-muted-foreground/60"
      />
      <div
        className={cn(
          "relative flex w-48 items-center gap-3 rounded-lg border bg-card p-3 shadow-md transition-all",
          border,
          selected && "ring-2 ring-primary ring-offset-1 ring-offset-background",
          status === "removed" && "opacity-60",
        )}
      >
        <span
          className={cn(
            "absolute -right-1 -top-2 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium capitalize",
            badge,
          )}
        >
          <StatusIcon status={status} />
          {label}
        </span>
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted", color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-foreground">{data.name}</span>
          {data.subtitle && <span className="truncate text-xs text-muted-foreground">{data.subtitle}</span>}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-2.5 w-2.5 border-2 border-card bg-muted-foreground/60"
      />
    </>
  );
}

export const InfraNode = memo(InfraNodeComponent);
