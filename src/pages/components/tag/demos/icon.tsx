import { Twitter, Youtube, Facebook, Linkedin } from "lucide-react";
import { Tag } from "@/components/ui/tag";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag icon={<Twitter />} color="#55acee">Twitter</Tag>
      <Tag icon={<Youtube />} color="#cd201f">Youtube</Tag>
      <Tag icon={<Facebook />} color="#3b5999">Facebook</Tag>
      <Tag icon={<Linkedin />} color="#55acee">LinkedIn</Tag>
    </div>
  );
}
