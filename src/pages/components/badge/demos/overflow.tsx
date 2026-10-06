import { Badge } from "@/components/ui/badge";

const Box = () => <span className="block size-10 rounded-md bg-fill-secondary" />;

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Badge count={99}>
        <Box />
      </Badge>
      <Badge count={100}>
        <Box />
      </Badge>
      <Badge count={99} overflowCount={10}>
        <Box />
      </Badge>
      <Badge count={1000} overflowCount={999}>
        <Box />
      </Badge>
    </div>
  );
}
