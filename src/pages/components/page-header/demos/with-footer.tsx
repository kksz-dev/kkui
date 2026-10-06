import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs } from "@/components/ui/tabs";
import { Statistic } from "@/components/ui/statistic";
import { Button } from "@/components/ui/button";

export default function WithFooterDemo() {
  const [tab, setTab] = React.useState("summary");

  return (
    <PageHeader
      ghost={false}
      titleLevel={2}
      title="Claim batch 2026-08"
      subTitle="1,284 records"
      extra={<Button size="sm" type="primary">Submit</Button>}
      footer={
        <Tabs
          activeKey={tab}
          onChange={setTab}
          items={[
            { key: "summary", label: "Summary" },
            { key: "errors", label: "Errors" },
            { key: "history", label: "History" },
          ]}
        />
      }
    >
      <div className="flex flex-wrap gap-8">
        <Statistic title="Accepted" value={1180} />
        <Statistic title="Rejected" value={104} valueStyle={{ color: "var(--kk-error)" }} />
        <Statistic title="Amount" value={2840500} prefix="฿" />
      </div>
    </PageHeader>
  );
}
