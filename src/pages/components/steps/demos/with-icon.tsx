import { User, FileText, Smile, Sparkles } from "lucide-react";
import { Steps } from "@/components/ui/steps";

export default function WithIconDemo() {
  return (
    <Steps
      items={[
        {
          title: "Login",
          status: "finish",
          icon: <User className="size-5" />,
        },
        {
          title: "Verification",
          status: "finish",
          icon: <FileText className="size-5" />,
        },
        {
          title: "Pay",
          status: "process",
          icon: <Sparkles className="size-5" />,
        },
        {
          title: "Done",
          status: "wait",
          icon: <Smile className="size-5" />,
        },
      ]}
    />
  );
}
