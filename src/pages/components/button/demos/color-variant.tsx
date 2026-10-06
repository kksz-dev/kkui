import { Button } from "@/components/ui/button";

const variants = ["solid", "outlined", "dashed", "filled", "text", "link"] as const;
const colors = ["default", "primary", "danger"] as const;

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      {colors.map((color) => (
        <div key={color} className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} color={color}>
              {variant[0]!.toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}
