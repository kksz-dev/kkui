import { TrueFocus } from "@/components/ui/motion";

export default function Demo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <div className="text-xs text-text-tertiary">Automatic, one word at a time</div>
        <TrueFocus sentence="Bring focus to key information" />
      </div>
      <div className="space-y-1">
        <div className="text-xs text-text-tertiary">manualMode: follows the pointer</div>
        <TrueFocus
          sentence="Hover any word to focus it"
          manualMode
          blurAmount={6}
          borderColor="var(--kk-success)"
          glowColor="var(--kk-success-border)"
          animationDuration={0.3}
          pauseBetweenAnimations={2}
        />
      </div>
    </div>
  );
}
