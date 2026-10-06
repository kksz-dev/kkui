import { Badge } from "@/components/ui/badge";

export default function Demo() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Badge status="success" />
        <Badge status="error" />
        <Badge status="default" />
        <Badge status="processing" />
        <Badge status="warning" />
      </div>
      <div className="flex flex-col gap-1">
        <Badge status="success" text="Success" />
        <Badge status="error" text="Error" />
        <Badge status="default" text="Default" />
        <Badge status="processing" text="Processing" />
        <Badge status="warning" text="Warning" />
      </div>
    </div>
  );
}
