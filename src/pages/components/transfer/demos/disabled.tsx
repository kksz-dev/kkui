import * as React from "react";
import { Transfer, type TransferItem } from "@/components/ui/transfer";
import { Switch } from "@/components/ui/switch";

const mockData: TransferItem[] = Array.from({ length: 8 }).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}));

export default function Demo() {
  const [disabled, setDisabled] = React.useState(true);
  const [targetKeys, setTargetKeys] = React.useState<string[]>(["1", "3"]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <span>Disabled:</span>
        <Switch checked={disabled} onChange={setDisabled} />
      </div>

      <Transfer
        disabled={disabled}
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={(keys) => setTargetKeys(keys)}
        render={(item) => item.title ?? item.key}
      />
    </div>
  );
}
