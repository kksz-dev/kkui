import { Tooltip } from "@/components/ui/tooltip";

export default function Demo() {
  return (
    <Tooltip title="prompt text">
      <span className="cursor-help underline decoration-dotted">Tooltip will show on mouse enter.</span>
    </Tooltip>
  );
}
