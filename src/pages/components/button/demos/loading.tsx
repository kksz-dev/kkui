import { useState } from "react";
import { Power } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [loading, setLoading] = useState(false);
  const enterLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button type="primary" loading>Loading</Button>
        <Button type="primary" size="sm" loading>Loading</Button>
        <Button type="primary" icon={<Power />} loading />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="primary" loading={loading} onClick={enterLoading}>Click me!</Button>
        <Button type="primary" icon={<Power />} loading={loading} onClick={enterLoading}>Click me!</Button>
        <Button type="primary" icon={<Power />} iconPosition="end" loading={loading} onClick={enterLoading}>Icon at end</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="primary" loading={loading ? { delay: 500 } : false} onClick={enterLoading}>Delay 500ms</Button>
        <Button type="primary" loading={loading ? { icon: <Power className="animate-pulse" /> } : false} onClick={enterLoading}>Custom spinner</Button>
      </div>
    </div>
  );
}
