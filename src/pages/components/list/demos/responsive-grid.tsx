import { List, ListItem } from "@/components/ui/list";
import { Card } from "@/components/ui/card";

const data = [
  { title: "Title 1" },
  { title: "Title 2" },
  { title: "Title 3" },
  { title: "Title 4" },
  { title: "Title 5" },
  { title: "Title 6" },
];

export default function Demo() {
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
      }}
      dataSource={data}
      renderItem={(item) => (
        <ListItem>
          <Card title={item.title}>Card content</Card>
        </ListItem>
      )}
    />
  );
}
