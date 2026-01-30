import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RESOURCE_TYPES, type ResourceType } from "./resource-types";
import { SelectTypeStep, NameStep, CreateResourceDialogFooter } from "./create-resource";

export type { ResourceType } from "./resource-types";

type Step = "select" | "name";

interface CreateResourceDialogProps {
  onCreateResource: (type: ResourceType, name: string) => void;
}

export function CreateResourceDialog({ onCreateResource }: CreateResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("select");
  const [selectedType, setSelectedType] = useState<ResourceType | null>(null);
  const [name, setName] = useState("");

  const resetState = () => {
    setStep("select");
    setSelectedType(null);
    setName("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetState();
    }
  };

  const handleSelectType = (typeId: ResourceType) => {
    setSelectedType(typeId);
  };

  const handleContinue = () => {
    if (selectedType) {
      const type = RESOURCE_TYPES.find((t) => t.id === selectedType);
      setName(type?.defaultName ?? "resource-1");
      setStep("name");
    }
  };

  const handleBack = () => {
    setStep("select");
  };

  const handleCreate = () => {
    if (selectedType && name.trim()) {
      onCreateResource(selectedType, name.trim());
      setOpen(false);
      resetState();
    }
  };

  const selectedTypeConfig = RESOURCE_TYPES.find((t) => t.id === selectedType);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-sm">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="flex items-center gap-2 text-base">
            {step === "name" && (
              <button onClick={handleBack} className="rounded p-0.5 hover:bg-muted">
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            {step === "select" ? "Create new resource" : `New ${selectedTypeConfig?.name}`}
          </DialogTitle>
          <DialogDescription>
            {step === "select"
              ? "Select a resource type to add to your infrastructure"
              : "Configure your new resource"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          <SelectTypeStep selectedType={selectedType} onSelectType={handleSelectType} />
        ) : (
          selectedTypeConfig && (
            <NameStep
              selectedType={selectedTypeConfig}
              name={name}
              onNameChange={setName}
              onSubmit={handleCreate}
            />
          )
        )}

        <CreateResourceDialogFooter
          step={step}
          canContinue={!!selectedType}
          canCreate={!!name.trim()}
          onCancel={() => setOpen(false)}
          onContinue={handleContinue}
          onCreate={handleCreate}
        />
      </DialogContent>
    </Dialog>
  );
}
