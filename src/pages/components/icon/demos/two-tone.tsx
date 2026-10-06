import * as React from "react";
import {
  Icon,
  getTwoToneColor,
  setTwoToneColor,
  twoToneIconNames,
} from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export default function TwoToneDemo() {
  const [globalColor, setGlobalColor] = React.useState(String(getTwoToneColor()));

  const applyGlobal = (color: string) => {
    setTwoToneColor(color);
    setGlobalColor(String(getTwoToneColor()));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-5 text-3xl">
        <Icon twoTone="check-circle" twoToneColor="var(--color-success)" />
        <Icon twoTone="close-circle" twoToneColor="var(--color-error)" />
        <Icon twoTone="exclamation-circle" twoToneColor="var(--color-warning)" />
        <Icon twoTone="heart" twoToneColor={["var(--color-magenta)", "var(--color-magenta-border)"]} />
        <Icon twoTone="star" twoToneColor={["var(--color-gold)", "var(--color-gold-border)"]} />
        <Icon twoTone="lock" twoToneColor="var(--color-purple)" />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-text-secondary">
          Global two-tone color: <code>{globalColor}</code>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-2xl">
          {twoToneIconNames.map((glyph) => (
            <Icon key={glyph} twoTone={glyph} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" onClick={() => applyGlobal("var(--color-primary)")}>
            Reset
          </Button>
          <Button size="sm" onClick={() => applyGlobal("var(--color-magenta)")}>
            Magenta
          </Button>
          <Button size="sm" onClick={() => applyGlobal("var(--color-cyan)")}>
            Cyan
          </Button>
        </div>
      </div>
    </div>
  );
}
