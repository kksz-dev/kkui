import * as React from "react";
import { Transfer, type TransferItem } from "@/components/ui/transfer";

const mockData: TransferItem[] = [
  { key: "react", title: "React", description: "A JavaScript library for building user interfaces" },
  { key: "vue", title: "Vue.js", description: "The Progressive JavaScript Framework" },
  { key: "angular", title: "Angular", description: "The modern web developer's platform" },
  { key: "svelte", title: "Svelte", description: "Cybernetically enhanced web apps" },
  { key: "solid", title: "SolidJS", description: "Simple and performant reactivity" },
  { key: "next", title: "Next.js", description: "The React Framework for the Web" },
  { key: "remix", title: "Remix", description: "Focused on web standards and modern UX" },
  { key: "nuxt", title: "Nuxt", description: "Intuitive Vue Framework" },
];

export default function Demo() {
  const [targetKeys, setTargetKeys] = React.useState<string[]>(["react", "next"]);

  const filterOption = (inputValue: string, option: TransferItem) =>
    (option.title ?? "").toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

  return (
    <Transfer
      showSearch
      dataSource={mockData}
      filterOption={filterOption}
      targetKeys={targetKeys}
      onChange={(keys) => setTargetKeys(keys)}
      render={(item) => item.title ?? item.key}
    />
  );
}
