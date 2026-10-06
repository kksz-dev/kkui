import { notification } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const open = () => {
    const key = "invite";
    notification.open({
      key,
      message: "Team invitation",
      description: "Nara invited you to the Platform workspace.",
      duration: 0,
      actions: (
        <>
          <Button size="sm" onClick={() => notification.destroy(key)}>
            Later
          </Button>
          <Button size="sm" type="primary" onClick={() => notification.destroy(key)}>
            Accept
          </Button>
        </>
      ),
    });
  };

  return (
    <Button type="primary" onClick={open}>
      With actions
    </Button>
  );
}
