import { Link, useLocation } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const nameMap: Record<string, string> = {
  "/components": "Components",
  "/components/breadcrumb": "Breadcrumb",
};

export default function Demo() {
  const location = useLocation();
  const snippets = location.pathname.split("/").filter(Boolean);
  const items = [
    { title: <Link to="/">Home</Link> },
    ...snippets.map((_, i) => {
      const url = `/${snippets.slice(0, i + 1).join("/")}`;
      return { key: url, title: <Link to={url}>{nameMap[url] ?? url}</Link> };
    }),
  ];
  return <Breadcrumb items={items} />;
}
