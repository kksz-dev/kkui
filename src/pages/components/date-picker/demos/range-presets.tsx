import { DatePicker } from "@/components/ui/date-picker";
import dayjs from "dayjs";
import { tr, useLocale } from "@/i18n/locale";

export default function RangePresetsDemo() {
  const { l } = useLocale();
  const today = dayjs();
  const presets = [
    { label: l(tr("วันนี้", "Today")), value: [today.startOf("day"), today.endOf("day")] as [dayjs.Dayjs, dayjs.Dayjs] },
    {
      label: l(tr("เมื่อวาน", "Yesterday")),
      value: [today.subtract(1, "day").startOf("day"), today.subtract(1, "day").endOf("day")] as [
        dayjs.Dayjs,
        dayjs.Dayjs,
      ],
    },
    { label: l(tr("7 วันที่ผ่านมา", "Last 7 days")), value: [today.subtract(6, "day"), today] as [dayjs.Dayjs, dayjs.Dayjs] },
    { label: l(tr("30 วันที่ผ่านมา", "Last 30 days")), value: [today.subtract(29, "day"), today] as [dayjs.Dayjs, dayjs.Dayjs] },
    { label: l(tr("90 วันที่ผ่านมา", "Last 90 days")), value: [today.subtract(89, "day"), today] as [dayjs.Dayjs, dayjs.Dayjs] },
    {
      label: l(tr("เดือนนี้", "This month")),
      value: [today.startOf("month"), today.endOf("month")] as [dayjs.Dayjs, dayjs.Dayjs],
    },
    {
      label: l(tr("เดือนที่แล้ว", "Last month")),
      value: [
        today.subtract(1, "month").startOf("month"),
        today.subtract(1, "month").endOf("month"),
      ] as [dayjs.Dayjs, dayjs.Dayjs],
    },
  ];

  return (
    <DatePicker.RangePicker
      presets={presets}
      needConfirm
      className="w-[340px]"
      onChange={(_, strings) => console.log(strings)}
    />
  );
}
