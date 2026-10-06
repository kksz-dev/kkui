import { Calendar } from "@/components/ui/calendar";

export default function Demo() {
  return <Calendar onSelect={(date) => console.log(date)} />;
}