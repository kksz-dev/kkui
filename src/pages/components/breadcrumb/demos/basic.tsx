import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function Demo() {
  return (
    <Breadcrumb
      items={[
        { title: "Home" },
        { title: <a href="#">Application Center</a> },
        { title: <a href="#">Application List</a> },
        { title: "An Application" },
      ]}
    />
  );
}
