import { Watermark } from "@/components/ui/watermark";

export default function Demo() {
  return (
    <Watermark
      height={30}
      width={130}
      image="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*lkAoRbywo0oAAAAAAAAAAAAADrJ8AQ/original"
    >
      <div className="h-80 rounded-lg border border-border-secondary bg-bg-container p-6">
        <h4 className="text-base font-semibold text-text-heading">Graphic Image Watermark</h4>
        <p className="mt-2 text-sm text-text-secondary">
          Use the <code>image</code> prop to repeat a graphic logo or custom watermark image across the area.
        </p>
      </div>
    </Watermark>
  );
}
