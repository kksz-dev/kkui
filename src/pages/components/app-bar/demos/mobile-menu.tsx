import * as React from "react";
import { AppBar, type AppBarItem } from "@/components/ui/app-bar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const items: AppBarItem[] = [
  { key: "overview", label: "Overview" },
  { key: "inbox", label: "Inbox" },
  { key: "team", label: "Team" },
];

export default function MobileMenuDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <AppBar
        sticky={false}
        title="Mobile shell"
        items={items}
        defaultActiveKey="overview"
        onMenuClick={() => setOpen((v) => !v)}
        menuOpen={open}
        menuId="app-bar-mobile-nav"
        menuIcon={open ? <X className="size-5" /> : undefined}
        actions={<Button size="sm">Sign in</Button>}
        renderMobileMenu={(navItems, activeKey, select) =>
          open && (
            <nav id="app-bar-mobile-nav" aria-label="Mobile" className="flex flex-col gap-1 border-b border-border-secondary p-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  disabled={item.disabled}
                  aria-current={item.key === activeKey ? "page" : undefined}
                  onClick={() => {
                    select(item);
                    setOpen(false);
                  }}
                  className={`rounded-lg px-3 py-2 text-left text-sm ${
                    item.key === activeKey ? "bg-primary-bg text-primary" : "text-text-secondary hover:bg-fill-tertiary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )
        }
      />
      <div className="bg-bg-layout p-6 text-sm text-text-secondary">
        Tap the hamburger to toggle the menu. The inline items hide below the md breakpoint, so the menu carries the same items on small screens.
      </div>
    </div>
  );
}
