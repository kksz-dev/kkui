import { Alert } from "@/components/ui/alert";

export default function Demo() {
  return <Alert message="Info Text" type="info" closable={{ closeIcon: <span className="text-sm text-primary">Close Now</span> }} />;
}
