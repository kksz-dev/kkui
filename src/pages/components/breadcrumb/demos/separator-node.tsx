import { Breadcrumb } from "@/components/ui/breadcrumb";

const dot = <span className="inline-block size-1 rounded-full bg-text-quaternary" />;

export default function Demo() {
  return (
    <Breadcrumb
      separator={dot}
      items={[
        { title: "Home" },
        { title: "Application Center", href: "#" },
        { title: "Application List", href: "#" },
        { title: "An Application" },
      ]}
    />
  );
}
