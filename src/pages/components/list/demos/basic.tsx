import { List, ListItem, ListItemMeta } from "@/components/ui/list";

interface ItemData {
  title: string;
  avatar: string;
  description: string;
}

const data: ItemData[] = [
  {
    title: "KKUI Title 1",
    avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
    description: "KKUI, a design language for background applications, is refined by Ant UED Team",
  },
  {
    title: "KKUI Title 2",
    avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
    description: "KKUI, a design language for background applications, is refined by Ant UED Team",
  },
  {
    title: "KKUI Title 3",
    avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=3",
    description: "KKUI, a design language for background applications, is refined by Ant UED Team",
  },
  {
    title: "KKUI Title 4",
    avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=4",
    description: "KKUI, a design language for background applications, is refined by Ant UED Team",
  },
];

export default function Demo() {
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <ListItem
          actions={[
            <a key="list-loadmore-edit" className="text-primary hover:underline cursor-pointer">
              edit
            </a>,
            <a key="list-loadmore-more" className="text-primary hover:underline cursor-pointer">
              more
            </a>,
          ]}
        >
          <ListItemMeta
            avatar={
              <img
                src={item.avatar}
                alt="avatar"
                className="size-8 rounded-full bg-fill-tertiary"
              />
            }
            title={<a className="hover:text-primary transition-colors">{item.title}</a>}
            description={item.description}
          />
        </ListItem>
      )}
    />
  );
}
