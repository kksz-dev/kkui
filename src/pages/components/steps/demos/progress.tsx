import { CreditCard, ShoppingCart, Truck } from "lucide-react";
import { Steps } from "@/components/ui/steps";

const items = [
  { title: "Finished", description: "This is a description." },
  { title: "In Progress", subTitle: "60%", description: "This is a description." },
  { title: "Waiting", description: "This is a description." },
];

const iconItems = [
  { title: "Cart", icon: <ShoppingCart /> },
  { title: "Pay", icon: <CreditCard /> },
  { title: "Ship", icon: <Truck /> },
];

export default function ProgressDemo() {
  return (
    <div className="flex flex-col gap-8">
      <Steps current={1} percent={60} items={items} />
      <Steps current={1} percent={60} items={iconItems} />
      <Steps current={1} percent={60} progressDot items={items} />
    </div>
  );
}
