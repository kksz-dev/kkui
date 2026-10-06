import { Button } from "@/components/ui/button";
import { Toaster, toast } from "@/components/ui/toast";

export default function BasicDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => toast("Saved to drafts")}>
        Default
      </Button>
      <Button size="sm" onClick={() => toast.success("Claim submitted", { description: "1,284 records accepted." })}>
        Success
      </Button>
      <Button size="sm" onClick={() => toast.error("Upload failed", { description: "Check the connection and try again." })}>
        Error
      </Button>
      <Button size="sm" onClick={() => toast.warning("Session expires in 2 minutes")}>
        Warning
      </Button>
      <Button size="sm" onClick={() => toast.info("A new version is available")}>
        Info
      </Button>
      <Toaster />
    </div>
  );
}
