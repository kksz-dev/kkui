import { Cascader } from "@/components/ui/cascader";

const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [{ value: "xihu", label: "West Lake" }],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [{ value: "zhonghuamen", label: "Zhong Hua Men" }],
      },
    ],
  },
];

export default function Demo() {
  return <Cascader options={options} expandTrigger="hover" placeholder="Please select" />;
}
