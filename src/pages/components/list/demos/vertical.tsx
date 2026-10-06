import * as React from "react";
import { List, ListItem, ListItemMeta } from "@/components/ui/list";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";

interface ArticleItem {
  href: string;
  title: string;
  avatar: string;
  description: string;
  content: string;
  image: string;
}

const data: ArticleItem[] = Array.from({ length: 3 }).map((_, i) => ({
  href: "https://kkui.kksz.dev",
  title: `KKUI part ${i + 1}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description: "KKUI, a design language for background applications, is refined by Ant UED Team.",
  content:
    "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
  image: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
}));

const IconText = ({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) => (
  <span className="inline-flex items-center gap-1">
    <Icon className="size-4" />
    <span>{text}</span>
  </span>
);

export default function Demo() {
  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 3,
        total: 10,
      }}
      dataSource={data}
      footer={
        <div>
          <b>KKUI</b> footer part
        </div>
      }
      renderItem={(item) => (
        <ListItem
          key={item.title}
          actions={[
            <IconText icon={Star} text="156" key="list-vertical-star-o" />,
            <IconText icon={ThumbsUp} text="156" key="list-vertical-like-o" />,
            <IconText icon={MessageSquare} text="2" key="list-vertical-message" />,
          ]}
          extra={
            <img
              width={200}
              alt="logo"
              src={item.image}
              className="rounded-md border border-border-secondary max-w-full"
            />
          }
        >
          <ListItemMeta
            avatar={<img src={item.avatar} alt="avatar" className="size-8 rounded-full bg-fill-tertiary" />}
            title={<a href={item.href} className="hover:text-primary transition-colors">{item.title}</a>}
            description={item.description}
          />
          <div className="mt-3 text-sm text-text">{item.content}</div>
        </ListItem>
      )}
    />
  );
}
