import { useState } from "react";
import { Select } from "@/components/ui/select";

const provinceData = ["Zhejiang", "Jiangsu"];
const cityData: Record<string, string[]> = {
  Zhejiang: ["Hangzhou", "Ningbo", "Wenzhou"],
  Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"],
};

export default function Demo() {
  const [cities, setCities] = useState(cityData[provinceData[0]]);
  const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0]);

  const handleProvinceChange = (value: string) => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0]);
  };

  return (
    <div className="flex gap-2">
      <Select defaultValue={provinceData[0]} className="w-30" onChange={handleProvinceChange} options={provinceData.map((p) => ({ label: p, value: p }))} />
      <Select className="w-30" value={secondCity} onChange={setSecondCity} options={cities.map((c) => ({ label: c, value: c }))} />
    </div>
  );
}
