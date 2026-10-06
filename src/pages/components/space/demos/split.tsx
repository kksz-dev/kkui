import { Space } from "@/components/ui/space";
import { Divider } from "@/components/ui/divider";
import { TypographyLink as Link } from "@/components/ui/typography";

export default function Demo() {
  return (
    <Space split={<Divider type="vertical" />}>
      <Link>Link</Link>
      <Link>Link</Link>
      <Link>Link</Link>
    </Space>
  );
}
