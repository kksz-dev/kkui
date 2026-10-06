import { useState } from "react";
import { Mentions, getMentions } from "@/components/ui/mentions";
import { Button } from "@/components/ui/button";

const options = ["afc163", "zombiej", "yesmeck"].map((value) => ({ value, label: value }));

export default function Demo() {
  const [coders, setCoders] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const submit = () => {
    const mentions = getMentions(coders);
    if (mentions.length < 2) {
      setError("More than one must be selected!");
      setResult(null);
      return;
    }
    setError(null);
    setResult(JSON.stringify({ coders: mentions.map((m) => m.value), bio }));
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span>Top coders</span>
        <Mentions className="w-full" rows={1} value={coders} onChange={setCoders} status={error ? "error" : undefined} placeholder="You can use @ to ref user here" options={options} />
        {error && <span className="text-error">{error}</span>}
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>Bio</span>
        <Mentions className="w-full" rows={3} value={bio} onChange={setBio} placeholder="You can use @ to ref user here" options={options} />
      </label>
      <div className="flex gap-2">
        <Button type="primary" htmlType="submit">Submit</Button>
        <Button htmlType="reset" onClick={() => { setCoders(""); setBio(""); setError(null); setResult(null); }}>
          Reset
        </Button>
      </div>
      {result && <pre className="rounded-md bg-fill-tertiary p-2 text-xs">{result}</pre>}
    </form>
  );
}
