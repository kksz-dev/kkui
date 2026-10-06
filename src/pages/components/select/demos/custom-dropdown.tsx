import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";

let index = 0;

export default function Demo() {
  const [items, setItems] = useState(["jack", "lucy"]);
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addItem = (e: React.MouseEvent) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <Select
      className="w-75"
      placeholder="custom dropdown render"
      popupRender={(menu) => (
        <>
          {menu}
          <Divider className="my-2" />
          <div className="flex gap-2 px-2 pb-1">
            <Input ref={inputRef} placeholder="Please enter item" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />
            <Button type="text" icon={<Plus />} onClick={addItem}>
              Add item
            </Button>
          </div>
        </>
      )}
      options={items.map((item) => ({ label: item, value: item }))}
    />
  );
}
