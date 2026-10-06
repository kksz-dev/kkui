import { Divider } from "@/components/ui/divider";

const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export default function Demo() {
  return (
    <>
      <p>{text}</p>
      <Divider />
      <p>{text}</p>
      <Divider dashed />
      <p>{text}</p>
      <Divider variant="dotted" />
      <p>{text}</p>
    </>
  );
}
