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
    <div className="flex flex-col gap-2">
      <Cascader
        className="w-full"
        options={options}
        multiple
        maxTagCount="responsive"
        showCheckedStrategy="SHOW_CHILD"
        defaultValue={[["bamboo", "little", "fish"], ["bamboo", "little", "cards"], ["bamboo", "little", "bird"]]}
        placeholder="SHOW_CHILD"
      />
      <Cascader
        className="w-full"
        options={options}
        multiple
        maxTagCount="responsive"
        showCheckedStrategy="SHOW_PARENT"
        defaultValue={[["bamboo"]]}
        placeholder="SHOW_PARENT"
      />
    </div>
  );
}
