import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownButton, type DropdownItemType } from "@/components/ui/dropdown";

const items: DropdownItemType[] = [
  { key: "1", label: "Submit and continue" },
  { key: "2", label: "Save as draft" },
];

export default function Demo() {
  const [loading, setLoading] = useState(false);
  const enterLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };
  return (
    <div className="flex flex-wrap gap-4">
      <DropdownButton type="primary" loading menu={{ items }}>
        Submit
      </DropdownButton>
      <DropdownButton type="primary" size="sm" loading menu={{ items }}>
        Submit
      </DropdownButton>
      <DropdownButton type="primary" loading={loading} onClick={enterLoading} menu={{ items }} icon={<ChevronDown />}>
        Submit
      </DropdownButton>
    </div>
  );
}
