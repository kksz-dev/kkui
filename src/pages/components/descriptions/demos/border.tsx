import { Descriptions, type DescriptionsItemType } from "@/components/ui/descriptions";
import { Badge } from "@/components/ui/badge";

const items: DescriptionsItemType[] = [
  { key: "1", label: "Product", children: "Cloud Database" },
  { key: "2", label: "Billing Mode", children: "Prepaid" },
  { key: "3", label: "Automatic Renewal", children: "YES" },
  { key: "4", label: "Order time", children: "2018-04-24 18:00:00" },
  { key: "5", label: "Usage Time", span: 2, children: "2019-04-24 18:00:00" },
  { key: "6", label: "Status", span: 3, children: <Badge status="processing" text="Running" /> },
  { key: "7", label: "Negotiated Amount", children: "$80.00" },
  { key: "8", label: "Discount", children: "$20.00" },
  { key: "9", label: "Official Receipts", children: "$60.00" },
  {
    key: "10",
    label: "Config Info",
    span: 3,
    children: (
      <div className="space-y-1">
        <div>Data disk type: MongoDB</div>
        <div>Database version: 3.4</div>
        <div>Package: dds.mongo.mid</div>
        <div>Storage space: 10 GB</div>
        <div>Replication factor: 3</div>
        <div>Region: East China 1</div>
      </div>
    ),
  },
];

export default function Demo() {
  return (
    <Descriptions title="User Info" bordered items={items} />
  );
}
