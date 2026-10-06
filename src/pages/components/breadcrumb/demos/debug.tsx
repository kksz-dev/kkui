import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb
        params={{ id: "1" }}
        items={[
          { path: "/home", title: "home" },
          { path: "/first", title: "first", menu: { items: [{ label: "General" }, { label: "Layout" }] } },
          { path: "/second", title: "second" },
          { path: "/:id", title: "params" },
        ]}
      />
      <Breadcrumb
        items={Array.from({ length: 12 }, (_, i) => ({ title: `Level ${i + 1}`, href: i < 11 ? "#" : undefined }))}
      />
    </div>
  );
}
