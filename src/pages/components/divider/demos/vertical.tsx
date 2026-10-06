import { Divider } from "@/components/ui/divider";

export default function Demo() {
  return (
    <>
      Text
      <Divider type="vertical" />
      <a href="#vertical">Link</a>
      <Divider type="vertical" />
      <a href="#vertical">Link</a>
      <Divider type="vertical" variant="dashed" />
      <a href="#vertical">Link</a>
    </>
  );
}
