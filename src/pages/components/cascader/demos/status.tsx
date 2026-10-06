import { Cascader } from "@/components/ui/cascader";

export default function Demo() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Cascader status="error" placeholder="Error" />
      <Cascader status="warning" multiple placeholder="Warning multiple" className="w-full" />
    </div>
  );
}
