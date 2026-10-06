import { TypographyParagraph as Paragraph, TypographyText as Text } from "@/components/ui/typography";

export default function Demo() {
  return (
    <>
      <Paragraph>
        A paragraph is a block-level text unit that keeps a bottom margin so consecutive paragraphs read as separate
        thoughts. Inline decorators such as <Text strong>strong</Text>, <Text code>code</Text> and <Text mark>mark</Text>{" "}
        can be mixed freely.
      </Paragraph>
      <Paragraph type="secondary">
        Secondary paragraphs use the secondary text token, which adapts automatically in dark mode.
      </Paragraph>
      <Paragraph disabled>Disabled paragraphs are dimmed and not selectable.</Paragraph>
      <Paragraph mark>
        Marked paragraphs highlight the whole block, useful when pointing readers to a note in a long document.
      </Paragraph>
    </>
  );
}
