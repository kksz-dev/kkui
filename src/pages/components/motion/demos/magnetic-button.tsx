import { MagneticButton } from "@/components/ui/motion";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <MagneticButton>Gentle pull (0.35)</MagneticButton>

      <MagneticButton strength={0.8} className="bg-primary text-white shadow-kk hover:bg-primary-hover">
        Strong pull (0.8)
      </MagneticButton>

      <MagneticButton strength={0} disabled className="opacity-60">
        Disabled, no pull
      </MagneticButton>
    </div>
  );
}
