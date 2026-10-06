import { Breadcrumb } from "@/components/ui/breadcrumb";

const menuItems = [
  { key: "1", label: "General" },
  { key: "2", label: "Layout" },
  { key: "3", label: "Navigation" },
];

export default function Demo() {
  return (
    <Breadcrumb
      items={[
        { title: "KKUI" },
        { title: <a href="#">Component</a> },
        { title: "General", menu: { items: menuItems }, dropdownProps: { placement: "bottomRight", arrow: true } },
        { title: "Button" },
      ]}
    />
  );
}
