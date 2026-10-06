import { useState } from "react";
import { InputTextArea } from "@/components/ui/input";

export default function Demo() {
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col gap-3">
      <InputTextArea placeholder="Autosize height based on content lines" autoSize />
      <InputTextArea placeholder="Autosize height with minimum and maximum number of lines" autoSize={{ minRows: 2, maxRows: 6 }} />
      <InputTextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Controlled autosize"
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </div>
  );
}
