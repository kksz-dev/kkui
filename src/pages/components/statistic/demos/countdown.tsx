import { StatisticCountdown } from "@/components/ui/statistic";

const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // 2 days 30s

export default function Demo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StatisticCountdown title="Countdown" value={deadline} />
        <StatisticCountdown
          title="Million Seconds"
          value={deadline}
          format="HH:mm:ss:SSS"
        />
      </div>
      <div>
        <StatisticCountdown
          title="Day Level"
          value={deadline}
          format="D 天 H 时 m 分 s 秒"
        />
      </div>
    </div>
  );
}
