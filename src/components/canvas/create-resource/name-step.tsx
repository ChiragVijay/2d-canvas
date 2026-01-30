import { Input } from "@/components/ui/input";
import type { ResourceTypeConfig } from "../resource-types";

interface NameStepProps {
  selectedType: ResourceTypeConfig;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
}

export function NameStep({ selectedType, name, onNameChange, onSubmit }: NameStepProps) {
  const Icon = selectedType.icon;

  return (
    <div className="space-y-3 p-5 pt-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <label htmlFor="resource-name" className="text-sm font-medium">
            Resource name
          </label>
          <Input
            id="resource-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="my-resource"
            className="mt-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) {
                onSubmit();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
