import { Checkbox } from "@/components/ui/checkbox";

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <Checkbox defaultChecked={false} disabled />
      <Checkbox indeterminate disabled />
      <Checkbox defaultChecked disabled />
      <Checkbox disabled>Disabled with label</Checkbox>
    </div>
  );
}
