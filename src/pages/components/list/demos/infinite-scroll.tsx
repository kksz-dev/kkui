import * as React from "react";
import { List, ListItem, ListItemMeta } from "@/components/ui/list";
import { Loader2 } from "lucide-react";

interface UserItem {
  name: { first: string; last: string };
  email: string;
  picture: { thumbnail: string };
}

export default function Demo() {
  const [data, setData] = React.useState<UserItem[]>([
    { name: { first: "Liam", last: "Smith" }, email: "liam@example.com", picture: { thumbnail: "https://api.dicebear.com/7.x/miniavs/svg?seed=liam" } },
    { name: { first: "Emma", last: "Johnson" }, email: "emma@example.com", picture: { thumbnail: "https://api.dicebear.com/7.x/miniavs/svg?seed=emma" } },
    { name: { first: "Noah", last: "Williams" }, email: "noah@example.com", picture: { thumbnail: "https://api.dicebear.com/7.x/miniavs/svg?seed=noah" } },
    { name: { first: "Olivia", last: "Brown" }, email: "olivia@example.com", picture: { thumbnail: "https://api.dicebear.com/7.x/miniavs/svg?seed=olivia" } },
    { name: { first: "William", last: "Jones" }, email: "william@example.com", picture: { thumbnail: "https://api.dicebear.com/7.x/miniavs/svg?seed=william" } },
  ]);
  const [loading, setLoading] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const appendData = () => {
    if (loading || data.length >= 20) return;
    setLoading(true);
    setTimeout(() => {
      const idx = data.length;
      const newItems: UserItem[] = [
        { name: { first: `User ${idx + 1}`, last: "Doe" }, email: `user${idx + 1}@example.com`, picture: { thumbnail: `https://api.dicebear.com/7.x/miniavs/svg?seed=user${idx + 1}` } },
        { name: { first: `User ${idx + 2}`, last: "Doe" }, email: `user${idx + 2}@example.com`, picture: { thumbnail: `https://api.dicebear.com/7.x/miniavs/svg?seed=user${idx + 2}` } },
        { name: { first: `User ${idx + 3}`, last: "Doe" }, email: `user${idx + 3}@example.com`, picture: { thumbnail: `https://api.dicebear.com/7.x/miniavs/svg?seed=user${idx + 3}` } },
      ];
      setData((prev) => [...prev, ...newItems]);
      setLoading(false);
    }, 600);
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 20) {
      appendData();
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="h-[300px] overflow-y-auto kk-scrollbar rounded-lg border border-border bg-bg-container px-4"
    >
      <List
        dataSource={data}
        renderItem={(item) => (
          <ListItem key={item.email}>
            <ListItemMeta
              avatar={<img src={item.picture.thumbnail} alt="avatar" className="size-8 rounded-full bg-fill-tertiary" />}
              title={<span>{item.name.first} {item.name.last}</span>}
              description={item.email}
            />
            <div>Content</div>
          </ListItem>
        )}
      />
      {loading && (
        <div className="flex items-center justify-center py-4 text-xs text-primary gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading more...</span>
        </div>
      )}
      {data.length >= 20 && (
        <div className="py-4 text-center text-xs text-text-quaternary">
          It is all, nothing more
        </div>
      )}
    </div>
  );
}
