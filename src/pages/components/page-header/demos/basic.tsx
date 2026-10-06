import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

export default function BasicDemo() {
  return (
    <PageHeader
      titleLevel={2}
      className="rounded-xl border border-border"
      breadcrumb={<Breadcrumb items={[{ title: "Home" }, { title: "Patients" }, { title: "HN 68-000142" }]} />}
      title="Somchai Jaidee"
      subTitle="HN 68-000142 · 42y"
      tags={<Tag color="success">Active</Tag>}
      onBack={() => console.log("back")}
      extra={
        <>
          <Button size="sm">Print</Button>
          <Button size="sm" type="primary">
            New visit
          </Button>
        </>
      }
    >
      Last visit 12 Aug 2026 — follow-up for hypertension.
    </PageHeader>
  );
}
