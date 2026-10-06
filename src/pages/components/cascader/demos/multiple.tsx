import { Cascader } from "@/components/ui/cascader";

const options = [
  {
    label: "Light",
    value: "light",
    children: Array.from({ length: 20 }).map((_, index) => ({ label: `Number ${index}`, value: index })),
  },
  {
    label: "Bamboo",
    value: "bamboo",
    children: [
      {
        label: "Little",
        value: "little",
        children: [
          { label: "Toy Fish", value: "fish" },
          { label: "Toy Cards", value: "cards" },
          { label: "Toy Bird", value: "bird" },
        ],
      },
    ],
  },
];

export default function Demo() {
  return (
    <Cascader
      className="w-full"
      options={options}
      multiple
      maxTagCount="responsive"
      defaultValue={[
        ["bamboo", "little", "fish"],
        ["bamboo", "little", "cards"],
      ]}
      onChange={(value) => console.log(value)}
      placeholder="Please select"
    />
  );
}
