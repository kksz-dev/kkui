import { Watermark } from "@/components/ui/watermark";

export default function Demo() {
  return (
    <Watermark content={["KKUI Design", "Internal Confidential"]}>
      <div className="h-80 rounded-lg border border-border-secondary bg-bg-container p-6">
        <h4 className="text-base font-semibold text-text-heading">Multi-line Watermark Protection</h4>
        <p className="mt-2 text-sm text-text-secondary">
          Pass an array of strings to the <code>content</code> prop to render multi-line watermark labels.
          Lines will be spaced automatically and rendered in the rotated pattern.
        </p>
      </div>
    </Watermark>
  );
}
