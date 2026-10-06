import { ConfigProvider } from "@/components/ui/config-provider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tag } from "@/components/ui/tag";

export default function BasicDemo() {
  return (
    <div className="flex flex-col gap-4">
      <ConfigProvider theme={{ token: { colorPrimary: "#722ed1", borderRadius: 10 } }} applyToRoot={false}>
        <div className="flex items-center gap-3">
          <Button type="primary">Purple</Button>
          <Switch defaultChecked />
          <Tag color="primary">Tag</Tag>
        </div>
      </ConfigProvider>

      <ConfigProvider theme={{ token: { colorPrimary: "#13c2c2", borderRadius: 2 } }} applyToRoot={false}>
        <div className="flex items-center gap-3">
          <Button type="primary">Cyan</Button>
          <Switch defaultChecked />
          <Tag color="primary">Tag</Tag>
        </div>
      </ConfigProvider>
    </div>
  );
}
