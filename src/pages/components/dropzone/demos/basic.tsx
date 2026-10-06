import { Dropzone } from "@/components/ui/dropzone";

export default function Demo() {
  return (
    <Dropzone
      maxFiles={4}
      maxSizeMB={5}
      accept="image/*,.pdf,.doc,.docx"
      onFilesChange={(files) => console.log(files.map((f) => `${f.name} ${f.status}`))}
    />
  );
}
