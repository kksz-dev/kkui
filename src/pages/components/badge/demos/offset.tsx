import { Badge } from "@/components/ui/badge";

const Box = () => <span className="block size-10 rounded-md bg-fill-secondary" />;

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Badge count={5} offset={[10, 10]}>
        <Box />
      </Badge>
      <Badge dot offset={[-6, 6]}>
        <Box />
      </Badge>
    </div>
  );
}
