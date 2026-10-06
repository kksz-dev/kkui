import { Result } from "@/components/ui/result";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={<Button type="primary">Back Home</Button>}
    />
  );
}
