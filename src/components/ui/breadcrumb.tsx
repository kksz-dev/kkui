import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dropdown, type DropdownProps } from "@/components/ui/dropdown";

/** Everything Dropdown accepts except what Breadcrumb owns (`menu` / `children`). */
export type BreadcrumbDropdownProps = Omit<DropdownProps, "menu" | "children">;

export interface BreadcrumbMenuItem {
  key?: React.Key;
  label: React.ReactNode;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface BreadcrumbItemType {
  key?: React.Key;
  title?: React.ReactNode;
  href?: string;
  path?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  menu?: { items: BreadcrumbMenuItem[] };
  dropdownProps?: BreadcrumbDropdownProps;
  type?: "separator";
  separator?: React.ReactNode;
}

export type BreadcrumbItemRender = (
  route: BreadcrumbItemType,
  params: Record<string, string>,
  routes: BreadcrumbItemType[],
  paths: string[],
) => React.ReactNode;

export interface BreadcrumbProps extends Omit<React.ComponentProps<"nav">, "children"> {
  items?: BreadcrumbItemType[];
  separator?: React.ReactNode;
  itemRender?: BreadcrumbItemRender;
  params?: Record<string, string>;
  children?: React.ReactNode;
}

const BreadcrumbContext = React.createContext<{ separator: React.ReactNode }>({ separator: "/" });

function fillParams(path: string, params: Record<string, string>) {
  return path.replace(/:(\w+)/g, (m, k: string) => params[k] ?? m);
}

function BreadcrumbSeparator({ className, children, ...props }: React.ComponentProps<"li">) {
  const { separator } = React.useContext(BreadcrumbContext);
  const content = children === undefined ? separator : children;
  return (
    <li
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn("mx-2 text-text-quaternary select-none", className)}
      {...props}
    >
      {content}
    </li>
  );
}

const linkClass =
  "inline-flex items-center gap-1 rounded-sm px-1 py-0.5 text-sm transition-colors duration-mid";

export interface BreadcrumbItemProps extends React.ComponentProps<"li"> {
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  menu?: { items: BreadcrumbMenuItem[] };
  dropdownProps?: BreadcrumbDropdownProps;
  current?: boolean;
}

function BreadcrumbItem({
  href,
  onClick,
  menu,
  dropdownProps,
  current = false,
  className,
  children,
  ...props
}: BreadcrumbItemProps) {
  const base = cn(
    linkClass,
    current
      ? "text-text font-normal"
      : "cursor-pointer text-text-tertiary hover:bg-fill-tertiary hover:text-text",
  );

  const label = href ? (
    <a href={href} onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>} className={base}>
      {children}
    </a>
  ) : (
    <span onClick={onClick} className={base}>
      {children}
    </span>
  );

  return (
    <li data-slot="breadcrumb-item" className={cn("flex items-center", className)} {...props}>
      {menu ? (
        <Dropdown
          {...dropdownProps}
          menu={{
            items: menu.items.map((it, i) => ({
              key: String(it.key ?? i),
              label: it.href ? <a href={it.href}>{it.label}</a> : it.label,
              disabled: it.disabled,
              onClick: it.onClick ? () => it.onClick!() : undefined,
            })),
          }}
        >
          <span className={cn(linkClass, "cursor-pointer text-text-tertiary hover:bg-fill-tertiary hover:text-text")}>
            {children}
            <ChevronDown className="size-3" />
          </span>
        </Dropdown>
      ) : (
        label
      )}
    </li>
  );
}

function Breadcrumb({ items, separator = "/", itemRender, params = {}, className, children, ...props }: BreadcrumbProps) {
  let content: React.ReactNode = children;

  if (items) {
    const nodes: React.ReactNode[] = [];
    const paths: string[] = [];
    let lastIndex = -1;
    items.forEach((it, i) => {
      if (it.type !== "separator") lastIndex = i;
    });

    items.forEach((route, index) => {
      if (route.type === "separator") {
        nodes.push(<BreadcrumbSeparator key={`sep-${index}`}>{route.separator}</BreadcrumbSeparator>);
        return;
      }
      if (route.path !== undefined) paths.push(fillParams(route.path, params).replace(/^\//, ""));
      const isLast = index === lastIndex;
      const href = route.href ?? (route.path !== undefined && !isLast ? "/" + paths.join("/") : undefined);

      let inner: React.ReactNode;
      if (itemRender) {
        inner = (
          <li data-slot="breadcrumb-item" className={cn("flex items-center", route.className)} key={route.key ?? index}>
            <span className={cn(linkClass, isLast ? "text-text" : "text-text-tertiary hover:bg-fill-tertiary hover:text-text")}>
              {itemRender(route, params, items, paths.slice())}
            </span>
          </li>
        );
      } else {
        inner = (
          <BreadcrumbItem
            key={route.key ?? index}
            href={href}
            onClick={route.onClick}
            menu={route.menu}
            dropdownProps={route.dropdownProps}
            current={isLast}
            className={route.className}
          >
            {route.title}
          </BreadcrumbItem>
        );
      }
      nodes.push(inner);
      if (!isLast && index < items.length - 1 && items[index + 1]?.type !== "separator") {
        nodes.push(<BreadcrumbSeparator key={`sep-${index}`} />);
      }
    });
    content = nodes;
  }

  return (
    <BreadcrumbContext.Provider value={{ separator }}>
      <nav aria-label="Breadcrumb" data-slot="breadcrumb" className={cn("text-sm text-text-tertiary", className)} {...props}>
        <ol className="flex flex-wrap items-center">{content}</ol>
      </nav>
    </BreadcrumbContext.Provider>
  );
}

Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Separator = BreadcrumbSeparator;

export { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator };
