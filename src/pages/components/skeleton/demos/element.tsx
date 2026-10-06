import * as React from "react";
import {
  SkeletonButton,
  SkeletonAvatar,
  SkeletonInput,
  SkeletonImage,
  SkeletonNode,
} from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function ElementDemo() {
  const [active, setActive] = React.useState(true);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <SkeletonButton active={active} size="large" />
        <SkeletonButton active={active} shape="round" />
        <SkeletonButton active={active} shape="circle" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SkeletonAvatar active={active} size="large" />
        <SkeletonAvatar active={active} shape="square" />
        <SkeletonAvatar active={active} size="small" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SkeletonInput active={active} size="large" />
        <SkeletonInput active={active} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SkeletonImage active={active} />
        <SkeletonNode active={active}>Custom Content</SkeletonNode>
      </div>

      <div>
        <Button size="sm" onClick={() => setActive(!active)}>
          Toggle Active Shimmer: {active ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  );
}
