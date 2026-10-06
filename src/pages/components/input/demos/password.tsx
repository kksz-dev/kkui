import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputPassword } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <InputPassword placeholder="input password" />
      <InputPassword placeholder="custom icon" iconRender={(v) => (v ? <Eye /> : <EyeOff />)} />
      <div className="flex gap-2">
        <InputPassword placeholder="input password" visibilityToggle={{ visible, onVisibleChange: setVisible }} />
        <Button className="w-20" onClick={() => setVisible((p) => !p)}>
          {visible ? "Hide" : "Show"}
        </Button>
      </div>
      <InputPassword disabled placeholder="disabled input password" />
    </div>
  );
}
