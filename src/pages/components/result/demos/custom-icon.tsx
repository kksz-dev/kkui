import { Smile } from "lucide-react";
import { Result } from "@/components/ui/result";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Result
      icon={<Smile className="text-primary" strokeWidth={1.5} />}
      title="Great, we have done all the operations!"
      extra={<Button type="primary">Next</Button>}
    />
  );
}
