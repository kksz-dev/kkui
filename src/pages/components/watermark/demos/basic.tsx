import { Watermark } from "@/components/ui/watermark";

export default function Demo() {
  return (
    <Watermark content="KKUI Design">
      <div className="h-80 rounded-lg border border-border-secondary bg-bg-container p-6">
        <h4 className="text-base font-semibold text-text-heading">Confidential Document</h4>
        <p className="mt-2 text-sm text-text-secondary">
          The KKUI design system provides a comprehensive set of accessible, high-quality components
          tailored for enterprise applications. This document contains proprietary guidelines and
          confidential project details that are intended solely for authorized personnel.
        </p>
        <p className="mt-4 text-sm text-text-secondary">
          Unauthorized reproduction, disclosure, or distribution of this material is strictly prohibited.
          Please contact security compliance if you encounter unwatermarked copies.
        </p>
      </div>
    </Watermark>
  );
}
