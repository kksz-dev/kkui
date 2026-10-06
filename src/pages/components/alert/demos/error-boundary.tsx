import { useState } from "react";
import { AlertErrorBoundary } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

function ThrowError() {
  const [error, setError] = useState<Error | null>(null);
  const onClick = () => setError(new Error("An Uncaught Error"));
  if (error) throw error;
  return (
    <Button danger onClick={onClick}>
      Click me to throw a error
    </Button>
  );
}

export default function Demo() {
  return (
    <AlertErrorBoundary>
      <ThrowError />
    </AlertErrorBoundary>
  );
}
