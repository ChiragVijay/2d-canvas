import { Button } from "@/components/ui/button";

interface DialogFooterProps {
  step: "select" | "name";
  canContinue: boolean;
  canCreate: boolean;
  onCancel: () => void;
  onContinue: () => void;
  onCreate: () => void;
}

export function CreateResourceDialogFooter({
  step,
  canContinue,
  canCreate,
  onCancel,
  onContinue,
  onCreate,
}: DialogFooterProps) {
  return (
    <div className="flex justify-end gap-2 border-t border-border bg-muted/30 px-4 py-3">
      <Button variant="ghost" size="sm" onClick={onCancel}>
        Cancel
      </Button>
      {step === "select" ? (
        <Button size="sm" onClick={onContinue} disabled={!canContinue}>
          Continue
        </Button>
      ) : (
        <Button size="sm" onClick={onCreate} disabled={!canCreate}>
          Create
        </Button>
      )}
    </div>
  );
}
