import { RadioButton, RadioGroup } from "@/components/ui/radio";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <RadioGroup defaultValue="a" buttonStyle="solid">
        <RadioButton value="a">Hangzhou</RadioButton>
        <RadioButton value="b">Shanghai</RadioButton>
        <RadioButton value="c">Beijing</RadioButton>
        <RadioButton value="d">Chengdu</RadioButton>
      </RadioGroup>
      <RadioGroup disabled defaultValue="c" buttonStyle="solid">
        <RadioButton value="a">Hangzhou</RadioButton>
        <RadioButton value="b">Shanghai</RadioButton>
        <RadioButton value="c">Beijing</RadioButton>
        <RadioButton value="d">Chengdu</RadioButton>
      </RadioGroup>
    </div>
  );
}
