import { BadgeRibbon } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function Demo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <BadgeRibbon text="Hippies">
        <Card title="Pushes open the window" size="small">and raises the spyglass.</Card>
      </BadgeRibbon>
      <BadgeRibbon text="Hippies" color="pink">
        <Card title="Pushes open the window" size="small">and raises the spyglass.</Card>
      </BadgeRibbon>
      <BadgeRibbon text="Hippies" color="red" placement="start">
        <Card title="Pushes open the window" size="small">and raises the spyglass.</Card>
      </BadgeRibbon>
      <BadgeRibbon text="Hippies" color="cyan">
        <Card title="Pushes open the window" size="small">and raises the spyglass.</Card>
      </BadgeRibbon>
      <BadgeRibbon text="Hippies" color="green" placement="start">
        <Card title="Pushes open the window" size="small">and raises the spyglass.</Card>
      </BadgeRibbon>
      <BadgeRibbon text="Hippies" color="#2db7f5">
        <Card title="Pushes open the window" size="small">and raises the spyglass.</Card>
      </BadgeRibbon>
    </div>
  );
}
