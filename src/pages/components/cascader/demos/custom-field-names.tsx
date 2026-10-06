import { Cascader } from "@/components/ui/cascader";

const options = [
  {
    code: "zhejiang",
    name: "Zhejiang",
    items: [
      {
        code: "hangzhou",
        name: "Hangzhou",
        items: [{ code: "xihu", name: "West Lake" }],
      },
    ],
  },
  {
    code: "jiangsu",
    name: "Jiangsu",
    items: [
      {
        code: "nanjing",
        name: "Nanjing",
        items: [{ code: "zhonghuamen", name: "Zhong Hua Men" }],
      },
    ],
  },
];

export default function Demo() {
  return (
    <Cascader
      fieldNames={{ label: "name", value: "code", children: "items" }}
      options={options}
      onChange={(value) => console.log(value)}
      placeholder="Please select"
    />
  );
}
