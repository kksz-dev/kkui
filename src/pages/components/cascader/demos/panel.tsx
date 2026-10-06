import { CascaderPanel } from "@/components/ui/cascader";

const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      { value: "hangzhou", label: "Hangzhou", children: [{ value: "xihu", label: "West Lake" }] },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      { value: "nanjing", label: "Nanjing", children: [{ value: "zhonghuamen", label: "Zhong Hua Men" }] },
    ],
  },
];

export default function Demo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <CascaderPanel options={options} onChange={(v) => console.log(v)} />
      <CascaderPanel multiple options={options} onChange={(v) => console.log(v)} />
    </div>
  );
}
