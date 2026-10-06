import { Divider } from "@/components/ui/divider";

const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export default function Demo() {
  return (
    <>
      <p>{text}</p>
      <Divider>Text</Divider>
      <p>{text}</p>
      <Divider orientation="left">Left Text</Divider>
      <p>{text}</p>
      <Divider orientation="right">Right Text</Divider>
      <p>{text}</p>
      <Divider orientation="left" orientationMargin={0}>
        Left Text with 0 orientationMargin
      </Divider>
      <p>{text}</p>
      <Divider orientation="right" orientationMargin={50}>
        Right Text with 50px orientationMargin
      </Divider>
      <p>{text}</p>
      <Divider orientation="start">Start Text (alias of left)</Divider>
      <p>{text}</p>
      <Divider orientation="end">End Text (alias of right)</Divider>
      <p>{text}</p>
    </>
  );
}
