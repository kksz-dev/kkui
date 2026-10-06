import { Ribbon, type RibbonTab } from "@/components/ui/ribbon";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, FilePlus, Save, Printer } from "lucide-react";

export default function Basic() {
  const tabs: RibbonTab[] = [
    {
      key: "home",
      label: "Home",
      groups: [
        {
          key: "file",
          title: "File",
          items: [
            <Button key="new" size="sm" variant="text" icon={<FilePlus className="size-4" />}>New</Button>,
            <Button key="save" size="sm" variant="text" icon={<Save className="size-4" />}>Save</Button>,
            <Button key="print" size="sm" variant="text" icon={<Printer className="size-4" />}>Print</Button>,
          ],
        },
        {
          key: "font",
          title: "Font",
          items: [
            <Button key="b" size="sm" variant="outlined" aria-label="Bold" icon={<Bold className="size-3.5" />} />,
            <Button key="i" size="sm" variant="outlined" aria-label="Italic" icon={<Italic className="size-3.5" />} />,
            <Button key="u" size="sm" variant="outlined" aria-label="Underline" icon={<Underline className="size-3.5" />} />,
          ],
        },
        {
          key: "paragraph",
          title: "Paragraph",
          items: [
            <Button key="left" size="sm" variant="text" aria-label="Align left" icon={<AlignLeft className="size-4" />} />,
            <Button key="center" size="sm" variant="text" aria-label="Align center" icon={<AlignCenter className="size-4" />} />,
            <Button key="right" size="sm" variant="text" aria-label="Align right" icon={<AlignRight className="size-4" />} />,
          ],
        },
      ],
    },
    {
      key: "insert",
      label: "Insert",
      groups: [
        {
          key: "tables",
          title: "Tables",
          items: [<Button key="t" size="sm" variant="outlined">Insert Table</Button>],
        },
      ],
    },
  ];

  return <Ribbon tabs={tabs} defaultActiveKey="home" />;
}
