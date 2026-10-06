import { useState } from "react";
import { AutoComplete } from "@/components/ui/auto-complete";
import { InputSearch } from "@/components/ui/input";

const getRandomInt = (max: number, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;

const searchResult = (query: string) =>
  Array.from({ length: getRandomInt(5) })
    .join(".")
    .split(".")
    .map((_, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        label: (
          <div className="flex justify-between">
            <span>
              Found {query} on{" "}
              <a href={`https://s.taobao.com/search?q=${query}`} target="_blank" rel="noopener noreferrer" className="text-primary">
                {category}
              </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        ),
      };
    });

export default function Demo() {
  const [options, setOptions] = useState<ReturnType<typeof searchResult>>([]);

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value: string) => {
    console.log("onSelect", value);
  };

  return (
    <AutoComplete popupMatchSelectWidth={252} className="w-75" options={options} onSelect={onSelect} onSearch={handleSearch} size="lg">
      <InputSearch size="lg" placeholder="input here" enterButton />
    </AutoComplete>
  );
}
