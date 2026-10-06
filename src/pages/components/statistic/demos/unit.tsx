import { Statistic } from "@/components/ui/statistic";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-8">
      <Statistic
        title="Feedback"
        value={1128}
        prefix={<ThumbsUp className="size-5 text-primary" />}
      />
      <Statistic
        title="Unmerged PRs"
        value={93}
        suffix="/ 100"
      />
      <Statistic
        title="Dislikes"
        value={12}
        prefix={<ThumbsDown className="size-5 text-text-tertiary" />}
      />
    </div>
  );
}
