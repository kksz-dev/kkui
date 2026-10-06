import * as React from "react";
import { ConfigProvider, useComponentDisabled } from "@/components/ui/config-provider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

/** A control that opts into the provider default via useComponentDisabled(). */
function ManagedButton({ disabled }: { disabled?: boolean }) {
  const isDisabled = useComponentDisabled(disabled);
  return (
    <Button type="primary" disabled={isDisabled}>
      Submit
    </Button>
  );
}

export default function DisabledDemo() {
  const [disabled, setDisabled] = React.useState(true);

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={disabled} onChange={setDisabled} />
        componentDisabled
      </label>

      <ConfigProvider componentDisabled={disabled} applyToRoot={false}>
        <div className="flex items-center gap-3">
          <ManagedButton />
          <Checkbox disabled={disabled}>Accept</Checkbox>
        </div>
      </ConfigProvider>
    </div>
  );
}
