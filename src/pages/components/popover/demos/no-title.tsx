import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Popover content="A popover without a title.">
        <Button>Content only</Button>
      </Popover>
      <Popover
        content={
          <div className="w-64">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-bg text-primary">K</span>
              <div>
                <div className="font-medium text-text-heading">KKUI</div>
                <div className="text-text-secondary">Rich content in a popover</div>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button size="sm">Cancel</Button>
              <Button size="sm" type="primary">
                Follow
              </Button>
            </div>
          </div>
        }
        placement="bottomLeft"
        trigger="click"
      >
        <Button type="primary">Rich content</Button>
      </Popover>
    </div>
  );
}
