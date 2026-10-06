import { CircleX } from "lucide-react";
import { Result } from "@/components/ui/result";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Result
      status="error"
      title="Submission Failed"
      subTitle="Please check and modify the following information before resubmitting."
      extra={[
        <Button type="primary" key="console">
          Go Console
        </Button>,
        <Button key="buy">Buy Again</Button>,
      ]}
    >
      <div className="text-text">
        <p className="mb-4 text-base font-medium text-text-heading">The content you submitted has the following error:</p>
        <p className="mb-2 flex items-center gap-2 text-text-secondary">
          <CircleX className="size-4 text-error" />
          Your account has been frozen.
          <a href="#" className="text-primary hover:text-primary-hover">
            Thaw immediately &gt;
          </a>
        </p>
        <p className="flex items-center gap-2 text-text-secondary">
          <CircleX className="size-4 text-error" />
          Your account is not yet eligible to apply.
          <a href="#" className="text-primary hover:text-primary-hover">
            Apply Unlock &gt;
          </a>
        </p>
      </div>
    </Result>
  );
}
