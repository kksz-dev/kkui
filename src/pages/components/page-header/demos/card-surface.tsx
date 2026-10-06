import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Avatar } from "@/components/ui/avatar";
import { message } from "@/components/ui/message";

export default function CardSurfaceDemo() {
  return (
    <PageHeader
      ghost={false}
      bordered
      avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" size={40} />}
      title="Dr. Saksit Dev"
      subTitle="Chief Technology Officer"
      tags={<Tag color="success">Active</Tag>}
      extra={[
        <Button key="edit" onClick={() => { message.info("Edit clicked"); }}>Edit Profile</Button>,
        <Button key="primary" type="primary" onClick={() => { message.success("Action submitted"); }}>Approve</Button>,
      ]}
      onBack={() => { message.info("Navigated back"); }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-text-secondary">
        <div><span className="text-text-tertiary">Department:</span> Digital Health</div>
        <div><span className="text-text-tertiary">Location:</span> Bangkok, Thailand</div>
        <div><span className="text-text-tertiary">Direct Reports:</span> 12 Members</div>
      </div>
    </PageHeader>
  );
}
