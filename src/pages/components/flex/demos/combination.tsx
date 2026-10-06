import { Flex } from "@/components/ui/flex";
import { Button } from "@/components/ui/button";
import { TypographyTitle as Title, TypographyText as Text } from "@/components/ui/typography";

const cardStyle = "w-[620px] max-w-full overflow-hidden rounded-lg border border-border-secondary";

export default function Demo() {
  return (
    <Flex gap="md" vertical>
      <Text type="secondary">Flex composed with a fixed image column and a growing content column:</Text>
      <div className={cardStyle}>
        <Flex justify="space-between">
          <div className="h-[200px] w-[273px] shrink-0 bg-gradient-to-br from-primary to-purple" />
          <Flex vertical align="flex-end" justify="space-between" className="p-8">
            <Title level={3}>KKUI + Flex</Title>
            <Text type="secondary" className="max-w-[240px] text-right">
              Fill the row, keep the picture rigid, push the button to the bottom-right corner.
            </Text>
            <Button type="primary" href="/components/flex" target="_blank">
              Get Started
            </Button>
          </Flex>
        </Flex>
      </div>
      <Flex gap="sm" wrap>
        <Flex flex="1 1 200px" align="center" justify="center" className="h-16 rounded-md bg-primary/15 text-sm">
          flex: 1 1 200px
        </Flex>
        <Flex flex="2 1 200px" align="center" justify="center" className="h-16 rounded-md bg-primary/30 text-sm">
          flex: 2 1 200px
        </Flex>
        <Flex flex="0 0 120px" align="center" justify="center" className="h-16 rounded-md bg-primary/45 text-sm">
          flex: 0 0 120px
        </Flex>
      </Flex>
      <Flex component="ul" gap="sm" className="list-none p-0 [&>li]:rounded-md [&>li]:bg-fill-tertiary [&>li]:px-3 [&>li]:py-1 [&>li]:text-sm">
        <li>component="ul"</li>
        <li>renders</li>
        <li>list items</li>
      </Flex>
    </Flex>
  );
}
