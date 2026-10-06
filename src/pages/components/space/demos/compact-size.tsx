import { SpaceCompact, useSpaceCompact } from "@/components/ui/space";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Controls that need the size in JS (not just height) can still read it from context. */
function CompactButton(props: React.ComponentProps<typeof Button>) {
  const compact = useSpaceCompact();
  return <Button size={compact?.size ?? "md"} {...props} />;
}

export default function Demo() {
  return (
    <div className="flex flex-col items-start gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <SpaceCompact key={size} size={size}>
          <Input placeholder={size} />
          <CompactButton type="primary">Submit</CompactButton>
        </SpaceCompact>
      ))}
    </div>
  );
}
