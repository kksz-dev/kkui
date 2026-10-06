import * as React from "react";
import { Map, type MapMarker } from "@/components/ui/map";
import { Button } from "@/components/ui/button";

const markers: MapMarker[] = [
  {
    key: "ctrhosp",
    lat: 13.7457,
    lng: 100.5348,
    title: "Chulalongkorn Hospital",
    popup: (
      <>
        <div className="font-medium text-text-heading">Chulalongkorn Hospital</div>
        <div className="mt-0.5 text-xs text-text-secondary">1873 Rama IV Rd, Pathum Wan</div>
        <Button size="sm" className="mt-2 w-full">
          Directions
        </Button>
      </>
    ),
  },
  {
    key: "siriraj",
    lat: 13.7576,
    lng: 100.4859,
    color: "var(--kk-chart-2)",
    title: "Siriraj Hospital",
    popup: <div className="font-medium text-text-heading">Siriraj Hospital</div>,
  },
  {
    key: "ramathibodi",
    lat: 13.7659,
    lng: 100.5262,
    color: "var(--kk-chart-4)",
    title: "Ramathibodi Hospital",
    popup: <div className="font-medium text-text-heading">Ramathibodi Hospital</div>,
  },
];

export default function BasicDemo() {
  const [view, setView] = React.useState({ center: { lat: 13.7563, lng: 100.5018 }, zoom: 12 });

  return (
    <div className="space-y-2">
      <Map
        markers={markers}
        defaultZoom={12}
        onChange={setView}
        height={320}
        scrollZoom={false}
      />
      <p className="font-mono text-xs text-text-tertiary">
        {view.center.lat.toFixed(4)}, {view.center.lng.toFixed(4)} · z{Math.round(view.zoom)}
      </p>
    </div>
  );
}
