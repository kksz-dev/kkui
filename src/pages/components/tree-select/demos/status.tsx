import { TreeSelect } from "@/components/ui/tree-select";

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <TreeSelect status="error" className="w-full" placeholder="Error" />
      <TreeSelect status="warning" multiple className="w-full" placeholder="Warning multiple" />
    </div>
  );
}
