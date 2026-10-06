import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";

export default function Demo() {
  const [current, setCurrent] = useState(3);
  return (
    <div className="flex flex-col gap-3">
      <Pagination current={current} onChange={(page) => setCurrent(page)} total={50} />
      <span className="text-sm text-text-secondary">Current page: {current}</span>
    </div>
  );
}
