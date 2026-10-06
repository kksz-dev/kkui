import { Flex } from "@/components/ui/flex";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Flex wrap gap="sm">
      {Array.from({ length: 24 }, (_, i) => (
        <Button key={i} type="primary">
          Button
        </Button>
      ))}
    </Flex>
  );
}
