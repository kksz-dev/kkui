import { Alert } from "@/components/ui/alert";

export default function Demo() {
  return (
    <Alert
      banner
      message={
        <div className="overflow-hidden whitespace-nowrap">
          <span className="inline-block animate-[kk-marquee_12s_linear_infinite] pl-[100%]">
            I can be a React component, multiple React components, or just some text.
          </span>
          <style>{`@keyframes kk-marquee { to { transform: translateX(-100%); } }`}</style>
        </div>
      }
    />
  );
}
