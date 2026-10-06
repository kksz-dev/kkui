import { Descriptions, type DescriptionsItemType } from "@/components/ui/descriptions";

const items: DescriptionsItemType[] = [
  { key: "1", label: "Product", children: "Cloud Database" },
  { key: "2", label: "Billing", children: "Prepaid" },
  { key: "3", label: "time", children: "18:00:00" },
  { key: "4", label: "Amount", children: "$80.00" },
  { key: "5", label: "Discount", children: "$20.00" },
  {
    key: "6",
    label: "Config Info",
    children: (
      <>
        Data disk: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
      </>
    ),
  },
];

export default function Demo() {
  return (
    <Descriptions
      title="Responsive Descriptions"
      bordered
      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      items={items}
    />
  );
}
