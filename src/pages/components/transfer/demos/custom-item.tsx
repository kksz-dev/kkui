import * as React from "react";
import { Transfer, type TransferItem } from "@/components/ui/transfer";
import { Tag } from "@/components/ui/tag";

interface CustomRecordType extends TransferItem {
  key: string;
  title: string;
  description: string;
  tag: string;
  tagColor?: "processing" | "success" | "warning" | "error";
}

const mockData: CustomRecordType[] = [
  { key: "1", title: "API Gateway", description: "Route HTTP requests", tag: "Backend", tagColor: "processing" },
  { key: "2", title: "Auth Service", description: "User login & JWT", tag: "Security", tagColor: "error" },
  { key: "3", title: "Web Frontend", description: "React 19 single page app", tag: "UI", tagColor: "success" },
  { key: "4", title: "Database cluster", description: "PostgreSQL read replica", tag: "Data", tagColor: "warning" },
  { key: "5", title: "Redis cache", description: "In-memory session store", tag: "Cache", tagColor: "processing" },
];

export default function Demo() {
  const [targetKeys, setTargetKeys] = React.useState<string[]>(["2", "3"]);

  const customRender = (item: CustomRecordType) => {
    return {
      label: (
        <span className="flex items-center justify-between w-full pr-1">
          <span>{item.title}</span>
          <Tag color={item.tagColor} className="text-[10px] py-0 px-1.5 h-4">
            {item.tag}
          </Tag>
        </span>
      ),
      value: item.title,
    };
  };

  return (
    <Transfer
      dataSource={mockData}
      listStyle={{ width: 240, height: 260 }}
      targetKeys={targetKeys}
      onChange={(keys) => setTargetKeys(keys)}
      render={customRender as (item: TransferItem) => { label: React.ReactNode; value: string }}
    />
  );
}
