import { List, ListItem } from "@/components/ui/list";
import { Card } from "@/components/ui/card";

const data = [
  { title: "Title 1" },
  { title: "Title 2" },
  { title: "Title 3" },
  { title: "Title 4" },
];

export default function Demo() {
  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      renderItem={(item) => (
        <ListItem>
          <Card title={item.title}>Card content</Card>
        </ListItem>
      )}
    />
  );
}
