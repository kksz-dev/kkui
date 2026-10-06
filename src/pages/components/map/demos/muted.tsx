import { Map, type MapMarker } from "@/components/ui/map";

const markers: MapMarker[] = [
  {
    key: "hospital",
    lat: 13.7462,
    lng: 100.5348,
    color: "#ef4444",
    popup: <div className="p-1 font-semibold text-sm">Central Medical Center</div>,
  },
  {
    key: "station",
    lat: 13.737,
    lng: 100.53,
    color: "#1677ff",
    popup: <div className="p-1 font-semibold text-sm">Main Train Terminal</div>,
  },
];

export default function MutedMapDemo() {
  return (
    <div className="space-y-2">
      <Map
        center={{ lat: 13.74, lng: 100.532 }}
        zoom={14}
        muted
        height={300}
        markers={markers}
      />
    </div>
  );
}
