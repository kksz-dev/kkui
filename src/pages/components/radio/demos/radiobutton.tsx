import { RadioButton, RadioGroup, type RadioChangeEvent } from "@/components/ui/radio";

export default function Demo() {
  const onChange = (e: RadioChangeEvent) => {
    console.log(`radio checked:${e.target.value}`);
  };
  return (
    <div className="flex flex-col gap-4">
      <RadioGroup onChange={onChange} defaultValue="a">
        <RadioButton value="a">Hangzhou</RadioButton>
        <RadioButton value="b">Shanghai</RadioButton>
        <RadioButton value="c">Beijing</RadioButton>
        <RadioButton value="d">Chengdu</RadioButton>
      </RadioGroup>
      <RadioGroup onChange={onChange} defaultValue="a">
        <RadioButton value="a">Hangzhou</RadioButton>
        <RadioButton value="b" disabled>Shanghai</RadioButton>
        <RadioButton value="c">Beijing</RadioButton>
        <RadioButton value="d">Chengdu</RadioButton>
      </RadioGroup>
      <RadioGroup disabled onChange={onChange} defaultValue="a">
        <RadioButton value="a">Hangzhou</RadioButton>
        <RadioButton value="b">Shanghai</RadioButton>
        <RadioButton value="c">Beijing</RadioButton>
        <RadioButton value="d">Chengdu</RadioButton>
      </RadioGroup>
    </div>
  );
}
