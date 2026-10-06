import * as React from "react";
import { List, ListItem, ListItemMeta } from "@/components/ui/list";
import { Button } from "@/components/ui/button";

interface UserItem {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

const initialList: UserItem[] = [
  { id: 1, name: "Edward King", email: "edward@example.com", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=edward" },
  { id: 2, name: "Lily Evans", email: "lily@example.com", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=lily" },
  { id: 3, name: "James Potter", email: "james@example.com", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=james" },
];

export default function Demo() {
  const [list, setList] = React.useState<UserItem[]>(initialList);
  const [loading, setLoading] = React.useState(false);

  const onLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const nextId = list.length + 1;
      const nextItems: UserItem[] = [
        { id: nextId, name: `User ${nextId}`, email: `user${nextId}@example.com`, avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=user${nextId}` },
        { id: nextId + 1, name: `User ${nextId + 1}`, email: `user${nextId + 1}@example.com`, avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=user${nextId + 1}` },
      ];
      setList((prev) => [...prev, ...nextItems]);
      setLoading(false);
    }, 800);
  };

  const loadMoreBtn = (
    <Button onClick={onLoadMore} loading={loading} disabled={list.length >= 9}>
      {list.length >= 9 ? "All loaded" : "loading more"}
    </Button>
  );

  return (
    <List
      bordered
      dataSource={list}
      loadMore={loadMoreBtn}
      renderItem={(item) => (
        <ListItem
          actions={[
            <a key="edit" className="text-primary hover:underline cursor-pointer">
              edit
            </a>,
            <a key="delete" className="text-error hover:underline cursor-pointer">
              delete
            </a>,
          ]}
        >
          <ListItemMeta
            avatar={<img src={item.avatar} alt="avatar" className="size-8 rounded-full bg-fill-tertiary" />}
            title={<span className="font-semibold">{item.name}</span>}
            description={item.email}
          />
        </ListItem>
      )}
    />
  );
}
