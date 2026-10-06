import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const userList = ["U", "Lucy", "Tom", "Edward", "Alexander"];
const colorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#1677ff"];

export default function AutoSize() {
  const [index, setIndex] = React.useState(0);

  const changeUser = () => {
    setIndex((prev) => (prev + 1) % userList.length);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar
          size="lg"
          style={{ backgroundColor: colorList[index], verticalAlign: "middle" }}
        >
          {userList[index]}
        </Avatar>
        <Button size="sm" onClick={changeUser}>
          Change User
        </Button>
      </div>
    </div>
  );
}
