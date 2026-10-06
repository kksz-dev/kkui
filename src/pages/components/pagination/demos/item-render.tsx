import { Pagination, type PaginationProps } from "@/components/ui/pagination";

const itemRender: PaginationProps["itemRender"] = (_, type, originalElement) => {
  if (type === "prev") return <a className="px-2">Previous</a>;
  if (type === "next") return <a className="px-2">Next</a>;
  return originalElement;
};

export default function Demo() {
  return <Pagination total={500} itemRender={itemRender} />;
}
