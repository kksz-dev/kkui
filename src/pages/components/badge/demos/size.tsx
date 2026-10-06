import { Badge } from "@/components/ui/badge";

const Box = () => <span className="block size-10 rounded-md bg-fill-secondary" />;

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Badge size="default" count={5}>
        <Box />
      </Badge>
      <Badge size="small" count={5}>
        <Box />
      </Badge>
      <Badge size="small" count={1000}>
        <Box />
      </Badge>
    </div>
  );
}
