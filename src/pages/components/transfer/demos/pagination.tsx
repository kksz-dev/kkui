import * as React from "react";
import { Transfer, type TransferItem } from "@/components/ui/transfer";

const mockData: TransferItem[] = Array.from({ length: 40 }).map((_, i) => ({
  key: i.toString(),
  title: `Item ${i + 1}`,
  description: `description of item ${i + 1}`,
}));

export default function Demo() {
  const [targetKeys, setTargetKeys] = React.useState<string[]>(["2", "5", "12", "18"]);

  return (
    <Transfer
      dataSource={mockData}
      pagination={{ pageSize: 8 }}
      listStyle={{ width: 220, height: 320 }}
      targetKeys={targetKeys}
      onChange={(keys) => setTargetKeys(keys)}
      render={(item) => item.title ?? item.key}
    />
  );
}
