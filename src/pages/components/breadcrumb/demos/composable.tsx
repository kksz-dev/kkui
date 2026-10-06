import { Home } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function Demo() {
  return (
    <Breadcrumb separator="/">
      <BreadcrumbItem href="#">
        <Home />
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="#">Application Center</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem menu={{ items: [{ label: "Overview" }, { label: "Settings" }] }}>Application List</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>An Application</BreadcrumbItem>
    </Breadcrumb>
  );
}
