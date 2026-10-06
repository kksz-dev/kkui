import { RadioButton, RadioGroup } from "@/components/ui/radio";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <RadioGroup defaultValue="a" size="lg">
        <RadioButton value="a">Hangzhou</RadioButton>
        <RadioButton value="b">Shanghai</RadioButton>
        <RadioButton value="c">Beijing</RadioButton>
        <RadioButton value="d">Chengdu</RadioButton>
      </RadioGroup>
      <RadioGroup defaultValue="a">
        <RadioButton value="a">Hangzhou</RadioButton>
        <RadioButton value="b">Shanghai</RadioButton>
        <RadioButton value="c">Beijing</RadioButton>
        <RadioButton value="d">Chengdu</RadioButton>
      </RadioGroup>
      <RadioGroup defaultValue="a" size="sm">
        <RadioButton value="a">Hangzhou</RadioButton>
        <RadioButton value="b">Shanghai</RadioButton>
        <RadioButton value="c">Beijing</RadioButton>
        <RadioButton value="d">Chengdu</RadioButton>
      </RadioGroup>
    </div>
  );
}
