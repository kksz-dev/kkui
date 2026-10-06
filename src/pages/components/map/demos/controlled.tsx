import * as React from "react";
import { Map, type LatLng } from "@/components/ui/map";
import { Segmented } from "@/components/ui/segmented";

const PLACES: Record<string, LatLng> = {
  Bangkok: { lat: 13.7563, lng: 100.5018 },
  "Chiang Mai": { lat: 18.7883, lng: 98.9853 },
  Phuket: { lat: 7.8804, lng: 98.3923 },
  "Khon Kaen": { lat: 16.4419, lng: 102.836 },
};

export default function ControlledDemo() {
  const [place, setPlace] = React.useState("Bangkok");

  return (
    <div className="space-y-3">
      <Segmented
        size="sm"
        value={place}
        onChange={(v) => setPlace(String(v))}
        options={Object.keys(PLACES).map((label) => ({ label, value: label }))}
      />
      <Map
        center={PLACES[place]}
        zoom={11}
        muted
        height={280}
        scrollZoom={false}
        markers={[{ key: place, ...PLACES[place], title: place }]}
        activeMarker={place}
      />
    </div>
  );
}
