import { ChevronLeft, ChevronRight, Cloud, CloudDownload } from "lucide-react";
import { Button, ButtonGroup } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <ButtonGroup>
        <Button type="primary" icon={<ChevronLeft />}>Go back</Button>
        <Button type="primary" icon={<ChevronRight />} iconPosition="end">Go forward</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button icon={<Cloud />} />
        <Button icon={<CloudDownload />} />
      </ButtonGroup>
      <ButtonGroup>
        <Button>Cancel</Button>
        <Button type="primary">OK</Button>
      </ButtonGroup>
      <ButtonGroup size="sm">
        <Button>Cancel</Button>
        <Button type="primary">OK</Button>
      </ButtonGroup>
    </div>
  );
}
