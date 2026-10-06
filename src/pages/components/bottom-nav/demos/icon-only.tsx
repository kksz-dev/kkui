import * as React from "react";
import { BottomNav, BottomNavSpacer } from "@/components/ui/bottom-nav";
import { Bell, Compass, Heart, Search } from "lucide-react";

export default function IconOnlyDemo() {
  const [active, setActive] = React.useState("explore");

  return (
    <div className="relative flex h-48 flex-col overflow-hidden rounded-xl border border-border bg-bg-layout [transform:translateZ(0)]">
      <div className="min-h-0 flex-1 p-6 text-sm text-text-secondary">Selected: {active}</div>
      <BottomNavSpacer />
      <BottomNav
        iconOnly
        activeKey={active}
        onChange={setActive}
        items={[
          { key: "explore", label: "Explore", icon: <Compass /> },
          { key: "search", label: "Search", icon: <Search /> },
          { key: "likes", label: "Likes", icon: <Heart />, activeIcon: <Heart fill="currentColor" /> },
          { key: "alerts", label: "Alerts", icon: <Bell />, badge: 3, badgeLabel: "3 new alerts" },
        ]}
      />
    </div>
  );
}
