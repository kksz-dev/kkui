import * as React from "react";
import { List, ListItem, ListItemMeta } from "@/components/ui/list";
import { RadioGroup } from "@/components/ui/radio";

const data = Array.from({ length: 23 }).map((_, i) => ({
  title: `KKUI Title ${i + 1}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description: "KKUI, a design language for background applications, is refined by Ant UED Team.",
}));

export default function Demo() {
  const [position, setPosition] = React.useState<"top" | "bottom" | "both">("bottom");
  const [align, setAlign] = React.useState<"start" | "center" | "end">("end");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Position:</span>
          <RadioGroup
            value={position}
            onChange={(e) => setPosition(e.target.value as "top" | "bottom" | "both")}
            optionType="button"
            options={[
              { label: "Top", value: "top" },
              { label: "Bottom", value: "bottom" },
              { label: "Both", value: "both" },
            ]}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Align:</span>
          <RadioGroup
            value={align}
            onChange={(e) => setAlign(e.target.value as "start" | "center" | "end")}
            optionType="button"
            options={[
              { label: "Start", value: "start" },
              { label: "Center", value: "center" },
              { label: "End", value: "end" },
            ]}
          />
        </div>
      </div>

      <List
        pagination={{
          position,
          align,
          pageSize: 4,
          total: data.length,
        }}
        dataSource={data}
        renderItem={(item) => (
          <ListItem>
            <ListItemMeta
              avatar={<img src={item.avatar} alt="avatar" className="size-8 rounded-full bg-fill-tertiary" />}
              title={<span>{item.title}</span>}
              description={item.description}
            />
          </ListItem>
        )}
      />
    </div>
  );
}
