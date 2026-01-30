import { useSyncExternalStore } from "react";
import { deploymentManager } from "@/lib/deployment-manager";

export function useDeployment(projectId: string, environment: string) {
  const isDeploying = useSyncExternalStore(
    (onStoreChange) => deploymentManager.subscribe(projectId, environment, onStoreChange),
    () => deploymentManager.isDeploying(projectId, environment),
    () => deploymentManager.isDeploying(projectId, environment),
  );

  const deploy = () => {
    deploymentManager.deploy(projectId, environment);
  };

  const abort = () => {
    deploymentManager.abort(projectId, environment);
  };

  return { isDeploying, deploy, abort };
}
