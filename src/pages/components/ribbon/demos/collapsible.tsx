import * as React from "react";
import { Ribbon, type RibbonTab } from "@/components/ui/ribbon";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  ImagePlus,
  Table2,
  Save,
  Undo2,
  Redo2,
  PaintBucket,
  Crop,
} from "lucide-react";

export default function CollapsibleDemo() {
  const [imageSelected, setImageSelected] = React.useState(true);

  const tabs: RibbonTab[] = [
    {
      key: "home",
      label: "Home",
      groups: [
        {
          key: "font",
          title: "Font",
          items: [
            { key: "bold", icon: <Bold className="size-3.5" />, label: "Bold", active: true },
            { key: "italic", icon: <Italic className="size-3.5" />, label: "Italic" },
            { key: "underline", icon: <Underline className="size-3.5" />, label: "Underline" },
          ],
        },
        {
          key: "insert",
          title: "Insert",
          items: [
            { key: "image", icon: <ImagePlus className="size-5" />, label: "Image", size: "lg" },
            { key: "table", icon: <Table2 className="size-5" />, label: "Table", size: "lg" },
          ],
        },
      ],
    },
    {
      key: "picture",
      label: "Format",
      contextual: true,
      contextualLabel: "Picture Tools",
      groups: [
        {
          key: "adjust",
          title: "Adjust",
          items: [
            { key: "fill", icon: <PaintBucket className="size-3.5" />, label: "Fill" },
            { key: "crop", icon: <Crop className="size-3.5" />, label: "Crop" },
          ],
        },
      ],
    },
  ];

  return (
    <div className="space-y-3">
      <Ribbon
        collapsible
        tabs={imageSelected ? tabs : tabs.filter((t) => !t.contextual)}
        quickAccess={
          <>
            <Button size="sm" variant="text" aria-label="Save" icon={<Save className="size-3.5" />} />
            <Button size="sm" variant="text" aria-label="Undo" icon={<Undo2 className="size-3.5" />} />
            <Button size="sm" variant="text" aria-label="Redo" icon={<Redo2 className="size-3.5" />} />
          </>
        }
      />
      <Button size="sm" onClick={() => setImageSelected((v) => !v)}>
        {imageSelected ? "Deselect picture" : "Select a picture"}
      </Button>
    </div>
  );
}
