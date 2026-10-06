import { Home, User } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function Demo() {
  return (
    <Breadcrumb
      items={[
        { href: "#", title: <Home /> },
        {
          href: "#",
          title: (
            <>
              <User />
              <span>Application List</span>
            </>
          ),
        },
        { title: "Application" },
      ]}
    />
  );
}
