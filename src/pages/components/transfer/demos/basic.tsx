import * as React from "react";
import { Transfer, type TransferItem } from "@/components/ui/transfer";

interface RecordType extends TransferItem {
  key: string;
  title: string;
  description: string;
  disabled?: boolean;
}

const mockData: RecordType[] = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
  disabled: i % 3 === 0,
}));

const initialTargetKeys = mockData.filter((item) => Number(item.key) > 10).map((item) => item.key);

export default function Demo() {
  const [targetKeys, setTargetKeys] = React.useState<string[]>(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <Transfer
      dataSource={mockData}
      titles={["Source", "Target"]}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={onChange}
      onSelectChange={onSelectChange}
      render={(item) => item.title}
    />
  );
}
