import { Input, InputTextArea } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Input showCount maxLength={20} onChange={(e) => console.log(e.target.value)} />
      <Input
        placeholder="count strategy by code point, max 10, cut on exceed"
        count={{
          show: true,
          max: 10,
          strategy: (txt) => [...txt].length,
          exceedFormatter: (txt, { max }) => [...txt].slice(0, max).join(""),
        }}
      />
      <InputTextArea showCount maxLength={100} placeholder="can resize" />
      <InputTextArea
        showCount={{ formatter: ({ count, maxLength }) => `${count} of ${maxLength ?? "∞"}` }}
        maxLength={100}
        rows={3}
        placeholder="custom formatter"
      />
    </div>
  );
}
