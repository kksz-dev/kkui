import { Switch } from "@/components/ui/switch";

export default function Demo() {
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  return <Switch defaultChecked onChange={onChange} />;
}
