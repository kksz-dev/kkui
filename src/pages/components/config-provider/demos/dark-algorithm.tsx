import { ConfigProvider, darkAlgorithm } from "@/components/ui/config-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DarkAlgorithmDemo() {
  return (
    <ConfigProvider
      theme={{ algorithm: darkAlgorithm, token: { colorPrimary: "#1668dc" } }}
      applyToRoot={false}
    >
      <div className="rounded-lg bg-bg-layout p-4">
        <Card title="Dark tokens">
          <p className="text-sm text-text-secondary">
            This subtree resolves its tokens through <code>darkAlgorithm</code>, independent of the site theme.
          </p>
          <Button type="primary" className="mt-3">
            Primary
          </Button>
        </Card>
      </div>
    </ConfigProvider>
  );
}
