import * as React from "react";
import { Transfer, type TransferItem } from "@/components/ui/transfer";

const mockData: TransferItem[] = Array.from({ length: 15 }).map((_, i) => ({
  key: i.toString(),
  title: `Option ${i + 1}`,
  description: `description of option ${i + 1}`,
}));

export default function Demo() {
  const [targetKeys, setTargetKeys] = React.useState<string[]>(["1", "4", "7"]);

  return (
    <Transfer
      oneWay
      dataSource={mockData}
      titles={["Source", "Target"]}
      targetKeys={targetKeys}
      onChange={(nextTargetKeys) => setTargetKeys(nextTargetKeys)}
      render={(item) => item.title ?? item.key}
    />
  );
}
