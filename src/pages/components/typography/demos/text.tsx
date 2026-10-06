import { TypographyText as Text, TypographyLink as Link } from "@/components/ui/typography";

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <Text>KKUI (default)</Text>
      <Text type="secondary">KKUI (secondary)</Text>
      <Text type="success">KKUI (success)</Text>
      <Text type="warning">KKUI (warning)</Text>
      <Text type="danger">KKUI (danger)</Text>
      <Text disabled>KKUI (disabled)</Text>
      <Text mark>KKUI (mark)</Text>
      <Text code>KKUI (code)</Text>
      <Text keyboard>KKUI (keyboard)</Text>
      <Text underline>KKUI (underline)</Text>
      <Text delete>KKUI (delete)</Text>
      <Text strong>KKUI (strong)</Text>
      <Text italic>KKUI (italic)</Text>
      <Link href="https://kkui.kksz.dev" target="_blank">
        KKUI (Link)
      </Link>
    </div>
  );
}
