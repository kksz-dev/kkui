import * as React from "react";
import { BottomNav, BottomNavSpacer } from "@/components/ui/bottom-nav";
import { Home, Mail, ShoppingCart } from "lucide-react";

/** Stand-in for your router's Link: runs onClick, then navigates without a reload. */
function Link({ href, onClick, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault(); // navigate(href) in a real app
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export default function LinksDemo() {
  const [path, setPath] = React.useState("/");

  return (
    <div className="relative flex h-48 flex-col overflow-hidden rounded-xl border border-border bg-bg-layout [transform:translateZ(0)]">
      <div className="min-h-0 flex-1 p-6 text-sm text-text-secondary">Path: {path}</div>
      <BottomNavSpacer />
      <BottomNav
        activeKey={path}
        onChange={setPath}
        linkRender={(item, content) => <Link href={item.href}>{content}</Link>}
        items={[
          { key: "/", label: "Home", icon: <Home />, href: "/" },
          { key: "/orders", label: "Orders", icon: <ShoppingCart />, href: "/orders" },
          { key: "/mail", label: "Mail", icon: <Mail />, href: "/mail", badge: 2, badgeLabel: "2 unread" },
        ]}
      />
    </div>
  );
}
