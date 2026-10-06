import { useState } from "react";
import { Highlighter, Sparkles } from "lucide-react";
import { TypographyParagraph as Paragraph } from "@/components/ui/typography";

export default function Demo() {
  const [editableStr, setEditableStr] = useState("This is an editable text.");
  const [customIconStr, setCustomIconStr] = useState("Custom Edit icon and replace tooltip text.");
  const [clickTriggerStr, setClickTriggerStr] = useState("Text or icon as trigger - click to start editing.");
  const [chooseTrigger, setChooseTrigger] = useState<("icon" | "text")[]>(["icon"]);
  const [customEnterIconStr, setCustomEnterIconStr] = useState("Editable text with a custom enter icon in edit field.");
  const [noEnterIconStr, setNoEnterIconStr] = useState("Editable text with no enter icon in edit field.");
  const [hideTooltipStr, setHideTooltipStr] = useState("Hide Edit tooltip.");
  const [lengthLimitedStr, setLengthLimitedStr] = useState("This is an editable text with limited length.");

  return (
    <div className="flex flex-col">
      <Paragraph editable={{ onChange: setEditableStr }}>{editableStr}</Paragraph>
      <Paragraph editable={{ icon: <Highlighter />, tooltip: "click to edit text", onChange: setCustomIconStr }}>
        {customIconStr}
      </Paragraph>
      <div className="mb-3 flex items-center gap-2 text-sm text-text-secondary">
        Trigger:
        {(["icon", "text"] as const).map((t) => (
          <label key={t} className="inline-flex items-center gap-1">
            <input
              type="checkbox"
              checked={chooseTrigger.includes(t)}
              onChange={(e) =>
                setChooseTrigger((prev) => (e.target.checked ? [...prev, t] : prev.filter((x) => x !== t)))
              }
            />
            {t}
          </label>
        ))}
      </div>
      <Paragraph editable={{ tooltip: "click to edit text", onChange: setClickTriggerStr, triggerType: chooseTrigger }}>
        {clickTriggerStr}
      </Paragraph>
      <Paragraph editable={{ enterIcon: <Sparkles />, tooltip: "click to edit text", onChange: setCustomEnterIconStr }}>
        {customEnterIconStr}
      </Paragraph>
      <Paragraph editable={{ enterIcon: null, tooltip: "click to edit text", onChange: setNoEnterIconStr }}>
        {noEnterIconStr}
      </Paragraph>
      <Paragraph editable={{ tooltip: false, onChange: setHideTooltipStr }}>{hideTooltipStr}</Paragraph>
      <Paragraph editable={{ maxLength: 50, autoSize: { maxRows: 5, minRows: 3 }, onChange: setLengthLimitedStr }}>
        {lengthLimitedStr}
      </Paragraph>
      <Paragraph copyable>This is a copyable text.</Paragraph>
      <Paragraph copyable={{ text: "Hello, KKUI!" }}>Replace copy text.</Paragraph>
      <Paragraph copyable={{ icon: [<Sparkles key="copy" />, <Highlighter key="copied" />], tooltips: ["click here", "you clicked!!"] }}>
        Custom Copy icon and replace tooltips text.
      </Paragraph>
      <Paragraph copyable={{ tooltips: false }}>Hide Copy tooltips.</Paragraph>
    </div>
  );
}
