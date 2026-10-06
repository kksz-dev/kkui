import { Result } from "@/components/ui/result";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary">Back Home</Button>}
    />
  );
}
