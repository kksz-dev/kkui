import { Button } from "@/components/ui/button";
import { Toaster, toast } from "@/components/ui/toast";

export default function ActionDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        onClick={() =>
          toast("Row deleted", {
            description: "HN 68-000142 was removed from the batch.",
            action: { label: "Undo", onClick: () => toast.success("Restored") },
            cancel: { label: "Dismiss", onClick: () => {} },
          })
        }
      >
        With actions
      </Button>

      <Button
        size="sm"
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1800)), {
            loading: "Sending 16 files…",
            success: "All files sent",
            error: "Transfer failed",
          })
        }
      >
        Promise
      </Button>

      <Button size="sm" variant="text" onClick={() => toast.dismiss()}>
        Dismiss all
      </Button>
      <Toaster />
    </div>
  );
}
