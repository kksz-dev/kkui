import { useCallback, useRef, useState } from "react";
import { Mentions, type MentionsOption } from "@/components/ui/mentions";

const USERS = ["afc163", "benjycui", "yiminghe", "RaoHai", "zombieJ", "yesmeck", "kksz"];

export default function Demo() {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<MentionsOption[]>([]);
  const ref = useRef<string>("");

  const onSearch = useCallback((search: string) => {
    ref.current = search;
    setLoading(!!search);
    setOptions([]);
    // simulate a request
    setTimeout(() => {
      if (ref.current !== search) return;
      setLoading(false);
      setOptions(
        USERS.filter((u) => u.toLowerCase().includes(search.toLowerCase())).map((u) => ({
          value: u,
          label: (
            <span className="flex items-center gap-2">
              <span className="size-5 rounded-full bg-primary-bg text-center text-xs leading-5 text-primary">{u[0].toUpperCase()}</span>
              {u}
            </span>
          ),
        })),
      );
    }, 500);
  }, []);

  return <Mentions className="w-full" loading={loading} onSearch={onSearch} filterOption={false} options={options} />;
}
