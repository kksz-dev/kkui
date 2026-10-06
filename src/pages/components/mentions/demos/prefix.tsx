import { useState } from "react";
import { Mentions, type MentionsOption } from "@/components/ui/mentions";

const MOCK_DATA: Record<string, string[]> = {
  "@": ["afc163", "zombiej", "yesmeck"],
  "#": ["1.0", "2.0", "3.0"],
};

export default function Demo() {
  const [prefix, setPrefix] = useState<"@" | "#">("@");
  const onSearch = (_: string, newPrefix: string) => setPrefix(newPrefix as "@" | "#");
  const options: MentionsOption[] = (MOCK_DATA[prefix] ?? []).map((value) => ({ value, label: value }));
  return (
    <Mentions
      className="w-full"
      placeholder="input @ to mention people, # to mention tag"
      prefix={["@", "#"]}
      onSearch={onSearch}
      options={options}
    />
  );
}
