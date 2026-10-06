import { useMemo, useRef, useState } from "react";
import { Select } from "@/components/ui/select";

const REPOS = ["react", "vue", "angular", "svelte", "solid", "preact", "lit", "qwik", "astro", "next", "nuxt", "remix", "vite", "bun", "deno"];

/** Fake async search: resolves after 400ms with repos containing the query. */
function fetchRepos(query: string): Promise<{ value: string; text: string }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(REPOS.filter((r) => r.includes(query.toLowerCase())).map((r) => ({ value: r, text: `${r} (${r.length * 1234} stars)` })));
    }, 400);
  });
}

export default function Demo() {
  const [data, setData] = useState<{ value: string; text: string }[]>([]);
  const [value, setValue] = useState<string>();
  const [fetching, setFetching] = useState(false);
  const timer = useRef<number>(undefined);
  const seq = useRef(0);

  const handleSearch = (text: string) => {
    window.clearTimeout(timer.current);
    if (!text) {
      setData([]);
      return;
    }
    const id = ++seq.current;
    setFetching(true);
    timer.current = window.setTimeout(() => {
      fetchRepos(text).then((res) => {
        if (id !== seq.current) return;
        setData(res);
        setFetching(false);
      });
    }, 300);
  };

  const options = useMemo(() => data.map((d) => ({ value: d.value, label: d.text })), [data]);

  return (
    <Select
      showSearch
      value={value}
      placeholder="input search text"
      className="w-50"
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      loading={fetching}
      onSearch={handleSearch}
      onChange={setValue}
      notFoundContent={null}
      options={options}
    />
  );
}
