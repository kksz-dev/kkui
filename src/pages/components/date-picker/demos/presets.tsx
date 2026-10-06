import { DatePicker } from "@/components/ui/date-picker";
import dayjs from "dayjs";
import { tr, useLocale } from "@/i18n/locale";

export default function PresetsDemo() {
  const { l } = useLocale();
  const presets = [
    { label: l(tr("วันนี้", "Today")), value: dayjs() },
    { label: l(tr("พรุ่งนี้", "Tomorrow")), value: dayjs().add(1, "day") },
    { label: l(tr("สัปดาห์หน้า", "Next Week")), value: dayjs().add(7, "day") },
    { label: l(tr("เดือนหน้า", "Next Month")), value: dayjs().add(1, "month") },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      <DatePicker presets={presets} />
    </div>
  );
}
