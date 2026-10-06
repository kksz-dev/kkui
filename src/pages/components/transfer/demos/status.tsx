import { Transfer, type TransferItem } from "@/components/ui/transfer";

const mockData: TransferItem[] = [
  { key: "1", title: "Item 1" },
  { key: "2", title: "Item 2" },
  { key: "3", title: "Item 3" },
];

export default function Demo() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-text-secondary mb-2 font-medium">Status: Error</div>
        <Transfer
          status="error"
          dataSource={mockData}
          targetKeys={["1"]}
          render={(item) => item.title ?? item.key}
        />
      </div>

      <div>
        <div className="text-xs text-text-secondary mb-2 font-medium">Status: Warning</div>
        <Transfer
          status="warning"
          dataSource={mockData}
          targetKeys={["2"]}
          render={(item) => item.title ?? item.key}
        />
      </div>
    </div>
  );
}
