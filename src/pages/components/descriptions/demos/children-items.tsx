import { Descriptions, DescriptionsItem } from "@/components/ui/descriptions";

export default function Demo() {
  return (
    <Descriptions title="Using Children API" bordered>
      <DescriptionsItem label="Product">Cloud Database</DescriptionsItem>
      <DescriptionsItem label="Billing">Prepaid</DescriptionsItem>
      <DescriptionsItem label="Time">18:00:00</DescriptionsItem>
      <DescriptionsItem label="Amount">$80.00</DescriptionsItem>
      <DescriptionsItem label="Discount" span={2}>
        $20.00
      </DescriptionsItem>
      <DescriptionsItem label="Official Receipts" span={3}>
        $60.00
      </DescriptionsItem>
    </Descriptions>
  );
}
