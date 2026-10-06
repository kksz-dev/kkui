import * as React from "react";
import { AppBar } from "@/components/ui/app-bar";

export default function LinksDemo() {
  const [active, setActive] = React.useState("home");

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <AppBar
        sticky={false}
        title="Docs"
        activeKey={active}
        onSelect={setActive}
        items={[
          { key: "home", label: "Home", href: "#home" },
          { key: "guide", label: "Guide", href: "#guide" },
          { key: "pricing", label: "Pricing", href: "#pricing" },
        ]}
        linkRender={(item, children) => <a href={item.href}>{children}</a>}
      />
      <div className="bg-bg-layout p-6 text-sm text-text-secondary">
        Items render as real links with <code>aria-current</code>. Swap the anchor for your router's Link. Active: {active}
      </div>
    </div>
  );
}
