import { Cascader, type CascaderOption } from "@/components/ui/cascader";

const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [{ value: "xihu", label: "West Lake", code: 752100 }],
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
        children: [{ value: "zhonghuamen", label: "Zhong Hua Men", code: 453400 }],
      },
    ],
  },
];

// The last item gets a link with its code
const displayRender = (labels: string[], selectedOptions?: CascaderOption[]) =>
  labels.map((label, i) => {
    const option = selectedOptions?.[i];
    if (i === labels.length - 1 && option?.code != null) {
      return (
        <span key={option.value ?? label}>
          {label} (
          <a
            className="text-primary"
            onClick={(e) => {
              e.stopPropagation();
              console.log("clicked", option.code);
            }}
          >
            {String(option.code)}
          </a>
          )
        </span>
      );
    }
    return <span key={option?.value ?? label}>{label} / </span>;
  });

export default function Demo() {
  return <Cascader options={options} defaultValue={["zhejiang", "hangzhou", "xihu"]} displayRender={displayRender} className="w-full" />;
}
