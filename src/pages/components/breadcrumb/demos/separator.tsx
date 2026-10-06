import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function Demo() {
  return (
    <Breadcrumb
      separator=">"
      items={[
        { title: "Home" },
        { title: "Application Center", href: "#" },
        { title: "Application List", href: "#" },
        { title: "An Application" },
      ]}
    />
  );
}
