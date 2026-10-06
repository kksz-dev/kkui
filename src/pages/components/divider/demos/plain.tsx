import { Divider } from "@/components/ui/divider";

const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export default function Demo() {
  return (
    <>
      <p>{text}</p>
      <Divider plain>Text</Divider>
      <p>{text}</p>
      <Divider orientation="left" plain>
        Left Text
      </Divider>
      <p>{text}</p>
      <Divider orientation="right" plain>
        Right Text
      </Divider>
      <p>{text}</p>
    </>
  );
}
