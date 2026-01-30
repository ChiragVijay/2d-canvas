import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RESOURCE_TYPES, type ResourceType } from "../resource-types";

interface SelectTypeStepProps {
  selectedType: ResourceType | null;
  onSelectType: (type: ResourceType) => void;
}

export function SelectTypeStep({ selectedType, onSelectType }: SelectTypeStepProps) {
  return (
    <div className="p-2">
      {RESOURCE_TYPES.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelectType(type.id)}
          className={cn(
            "relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
            selectedType === type.id ? "bg-secondary" : "hover:bg-muted",
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors",
              selectedType === type.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
            )}
          >
            <type.icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{type.name}</p>
            <p className="text-xs text-muted-foreground">{type.description}</p>
          </div>
          {selectedType === type.id && <Check className="h-4 w-4 text-foreground" />}
        </button>
      ))}
    </div>
  );
}
