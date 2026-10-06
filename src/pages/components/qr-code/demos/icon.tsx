import { QRCode } from "@/components/ui/qr-code";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-6">
      <QRCode
        value="https://kkui.kksz.dev/"
        icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      />
      <QRCode
        value="https://kkui.kksz.dev/"
        icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        iconSize={{ width: 32, height: 32 }}
      />
    </div>
  );
}
