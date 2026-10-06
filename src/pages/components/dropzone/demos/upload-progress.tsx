import { Dropzone } from "@/components/ui/dropzone";

/** Simulated transport: nothing is sent anywhere, the promise settles on a timer. */
const simulateUpload = (_file: File, onProgress: (percent: number) => void) =>
  new Promise<void>((resolve) => {
    let percent = 0;
    const timer = setInterval(() => {
      percent += 10;
      onProgress(percent);
      if (percent >= 100) {
        clearInterval(timer);
        resolve();
      }
    }, 200);
  });

export default function Demo() {
  return <Dropzone maxFiles={3} maxSizeMB={20} onUpload={simulateUpload} />;
}
