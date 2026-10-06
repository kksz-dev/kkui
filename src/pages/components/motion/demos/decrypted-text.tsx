import { DecryptedText } from "@/components/ui/motion";

export default function Demo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="space-y-1">
        <div className="text-xs text-text-tertiary">animateOn="hover" (default)</div>
        <DecryptedText text="Hover to decrypt" className="text-base font-semibold text-text-heading" />
      </div>

      <div className="space-y-1">
        <div className="text-xs text-text-tertiary">animateOn="view"</div>
        <DecryptedText
          text="Decrypts when scrolled into view"
          animateOn="view"
          speed={40}
          maxIterations={16}
          className="text-base font-semibold text-primary"
        />
      </div>

      <div className="space-y-1">
        <div className="text-xs text-text-tertiary">revealDirection="center" + encryptedClassName</div>
        <DecryptedText
          text="Reveal from the middle"
          revealDirection="center"
          encryptedClassName="text-text-quaternary"
          className="text-base font-semibold text-text-heading"
        />
      </div>

      <div className="space-y-1">
        <div className="text-xs text-text-tertiary">useOriginalCharsOnly + revealDirection="end"</div>
        <DecryptedText
          text="ONLY ITS OWN LETTERS"
          useOriginalCharsOnly
          revealDirection="end"
          className="text-base font-semibold text-success"
        />
      </div>

      <div className="space-y-1 sm:col-span-2">
        <div className="text-xs text-text-tertiary">sequential=false + custom characters</div>
        <DecryptedText
          text="All at once, binary noise"
          sequential={false}
          characters="01"
          speed={60}
          maxIterations={12}
          className="text-base font-semibold text-warning"
        />
      </div>
    </div>
  );
}
