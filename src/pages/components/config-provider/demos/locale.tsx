import * as React from "react";
import { ConfigProvider, thTH, enUS, useConfig, type KkLocale } from "@/components/ui/config-provider";
import { Segmented } from "@/components/ui/segmented";
import { Empty } from "@/components/ui/empty";

function LocalePreview() {
  const { locale } = useConfig();
  return (
    <div className="space-y-3">
      <Empty description={locale.Empty.description} />
      <ul className="text-xs text-text-secondary">
        <li>Table filter: {locale.Table.filterConfirm} / {locale.Table.filterReset}</li>
        <li>Modal: {locale.Modal.okText} / {locale.Modal.cancelText}</li>
        <li>Select: {locale.Select.placeholder}</li>
      </ul>
    </div>
  );
}

export default function LocaleDemo() {
  const [locale, setLocale] = React.useState<KkLocale>(thTH);

  return (
    <div className="flex flex-col gap-4">
      <Segmented
        value={locale.locale}
        onChange={(v) => setLocale(v === "th" ? thTH : enUS)}
        options={[
          { label: "ไทย", value: "th" },
          { label: "English", value: "en" },
        ]}
      />
      <ConfigProvider locale={locale} applyToRoot={false}>
        <LocalePreview />
      </ConfigProvider>
    </div>
  );
}
