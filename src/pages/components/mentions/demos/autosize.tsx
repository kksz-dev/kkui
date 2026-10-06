import { Mentions } from "@/components/ui/mentions";

export default function Demo() {
  return (
    <Mentions
      className="w-full"
      autoSize
      placeholder="grows with the content"
      options={[
        { value: "afc163", label: "afc163" },
        { value: "zombieJ", label: "zombieJ" },
        { value: "yesmeck", label: "yesmeck" },
      ]}
    />
  );
}
