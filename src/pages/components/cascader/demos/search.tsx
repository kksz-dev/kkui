import { Cascader, type CascaderOption } from "@/components/ui/cascader";

const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          { value: "xihu", label: "West Lake" },
          { value: "xiasha", label: "Xia Sha", disabled: true },
        ],
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

const filter = (inputValue: string, path: CascaderOption[]) =>
  path.some((option) => String(option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

export default function Demo() {
  return (
    <Cascader
      options={options}
      onChange={(v, so) => console.log(v, so)}
      placeholder="Please select"
      showSearch={{ filter }}
      onSearch={(value) => console.log(value)}
    />
  );
}
