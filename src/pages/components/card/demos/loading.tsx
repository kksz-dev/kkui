import { useState } from "react";
import { Card, CardMeta } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <Button type="primary" onClick={() => setLoading((v) => !v)} className="self-start">
        Toggle loading
      </Button>
      <Card loading={loading} className="min-w-[300px]">
        <CardMeta
          avatar={<img className="size-10 rounded-full" alt="" src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
          title="Card title"
          description="This is the description"
        />
      </Card>
    </div>
  );
}
