import * as React from "react";
import { Transfer, type TransferItem } from "@/components/ui/transfer";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const getMockData = (): TransferItem[] =>
  Array.from({ length: 20 }).map((_, i) => ({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    chosen: Math.random() * 2 > 1,
  }));

export default function Demo() {
  const [mockData, setMockData] = React.useState<TransferItem[]>(getMockData);
  const [targetKeys, setTargetKeys] = React.useState<string[]>([]);

  const refreshData = () => {
    setMockData(getMockData());
  };

  return (
    <Transfer
      dataSource={mockData}
      showSearch
      listStyle={{
        width: 250,
        height: 300,
      }}
      operations={["To right", "To left"]}
      targetKeys={targetKeys}
      onChange={(keys) => setTargetKeys(keys)}
      render={(item) => `${item.title}-${item.description}`}
      footer={(_, info) => (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="text"
            icon={<RefreshCw className="size-3" />}
            onClick={refreshData}
          >
            Reload {info?.direction}
          </Button>
        </div>
      )}
    />
  );
}
