import { InputOTP } from "@/components/ui/input";

export default function Demo() {
  const onChange = (text: string) => console.log("onChange:", text);
  const onInput = (value: string[]) => console.log("onInput:", value);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 text-sm font-medium">With formatter (Upcase)</div>
        <InputOTP formatter={(str) => str.toUpperCase()} onChange={onChange} onInput={onInput} />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">With Disabled</div>
        <InputOTP disabled defaultValue="123456" />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">With Length (8)</div>
        <InputOTP length={8} />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">With variant</div>
        <InputOTP variant="filled" />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">With custom display character</div>
        <InputOTP mask="🔒" />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">With separator</div>
        <InputOTP separator="-" />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">With status</div>
        <InputOTP status="error" size="sm" />
      </div>
    </div>
  );
}
