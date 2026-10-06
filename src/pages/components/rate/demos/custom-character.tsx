import { Rate } from "@/components/ui/rate";
import { Frown, Meh, Smile } from "lucide-react";

const customIcons: Record<number, React.ReactNode> = {
  1: <Frown className="size-6" />,
  2: <Frown className="size-6" />,
  3: <Meh className="size-6" />,
  4: <Smile className="size-6" />,
  5: <Smile className="size-6" />,
};

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Rate
        defaultValue={3}
        character={({ index }) => index + 1}
        className="text-base font-semibold"
      />
      <Rate
        defaultValue={3}
        character={({ index }) => customIcons[index + 1]}
      />
    </div>
  );
}
