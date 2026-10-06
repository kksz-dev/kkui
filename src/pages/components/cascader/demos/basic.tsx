import { Cascader, type CascaderOption } from "@/components/ui/cascader";

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
  const onChange = (value: (string | number)[], selectedOptions: CascaderOption[]) => {
    console.log(value, selectedOptions);
  };

  return <Cascader options={options} onChange={onChange} placeholder="Please select" />;
}
