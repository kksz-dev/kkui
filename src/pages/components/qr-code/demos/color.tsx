import { QRCode } from "@/components/ui/qr-code";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-6">
      <QRCode
        value="https://kkui.kksz.dev/"
        color="var(--kk-primary)"
        bgColor="var(--kk-primary-bg)"
      />
      <QRCode
        value="https://kkui.kksz.dev/"
        color="var(--kk-success)"
        bgColor="var(--kk-success-bg)"
      />
      <QRCode
        value="https://kkui.kksz.dev/"
        color="#722ed1"
        bgColor="#f9f0ff"
      />
    </div>
  );
}
