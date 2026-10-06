import { Mentions } from "@/components/ui/mentions";

export default function Demo() {
  return (
    <Mentions
      className="w-full"
      placement="top"
      placeholder="popup opens above the caret"
      options={[
        { value: "afc163", label: "afc163" },
        { value: "zombieJ", label: "zombieJ" },
        { value: "yesmeck", label: "yesmeck" },
      ]}
    />
  );
}
