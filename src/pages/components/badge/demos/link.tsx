import { Badge } from "@/components/ui/badge";

export default function Demo() {
  return (
    <a href="#" className="inline-block">
      <Badge count={5}>
        <span className="block size-10 rounded-md bg-fill-secondary transition-colors hover:bg-fill" />
      </Badge>
    </a>
  );
}
