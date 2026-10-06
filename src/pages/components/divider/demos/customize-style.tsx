import { Divider } from "@/components/ui/divider";

export default function Demo() {
  return (
    <>
      <Divider className="border-purple">Solid</Divider>
      <Divider className="border-magenta" dashed>
        Dashed
      </Divider>
      <Divider variant="dotted" className="border-cyan">
        Dotted
      </Divider>
      <Divider className="border-t-2 border-primary" />
    </>
  );
}
