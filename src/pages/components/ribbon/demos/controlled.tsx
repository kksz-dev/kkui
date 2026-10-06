import * as React from "react";
import { Ribbon, type RibbonTab } from "@/components/ui/ribbon";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Table2, ImagePlus, Ruler, Grid3x3 } from "lucide-react";

const tabs: RibbonTab[] = [
  {
    key: "home",
    label: "Home",
    groups: [
      {
        key: "font",
        title: "Font",
        items: [
          { key: "bold", icon: <Bold className="size-3.5" />, label: "Bold" },
          { key: "italic", icon: <Italic className="size-3.5" />, label: "Italic" },
        ],
      },
    ],
  },
  {
    key: "insert",
    label: "Insert",
    groups: [
      {
        key: "objects",
        title: "Objects",
        items: [
          { key: "table", icon: <Table2 className="size-5" />, label: "Table", size: "lg" },
          { key: "image", icon: <ImagePlus className="size-5" />, label: "Image", size: "lg" },
        ],
      },
    ],
  },
  {
    key: "view",
    label: "View",
    groups: [
      {
        key: "show",
        title: "Show",
        items: [
          { key: "ruler", icon: <Ruler className="size-3.5" />, label: "Ruler", active: true },
          { key: "grid", icon: <Grid3x3 className="size-3.5" />, label: "Gridlines" },
        ],
      },
    ],
  },
];

export default function Controlled() {
  const [activeKey, setActiveKey] = React.useState("insert");
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="space-y-3">
      <Ribbon
        collapsible
        tabs={tabs}
        activeKey={activeKey}
        onChange={setActiveKey}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Button key={t.key} size="sm" type={t.key === activeKey ? "primary" : "default"} onClick={() => setActiveKey(t.key)}>
            {t.label}
          </Button>
        ))}
        <Button size="sm" variant="outlined" onClick={() => setCollapsed((v) => !v)}>
          {collapsed ? "Expand" : "Collapse"}
        </Button>
      </div>
    </div>
  );
}
