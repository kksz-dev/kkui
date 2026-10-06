import { Mentions, type MentionsOption } from "@/components/ui/mentions";

export default function Demo() {
  const onChange = (value: string) => console.log("Change:", value);
  const onSelect = (option: MentionsOption) => console.log("select", option);
  return (
    <Mentions
      className="w-full"
      onChange={onChange}
      onSelect={onSelect}
      defaultValue="@afc163"
      options={[
        { value: "afc163", label: "afc163" },
        { value: "zombieJ", label: "zombieJ" },
        { value: "yesmeck", label: "yesmeck" },
      ]}
    />
  );
}
