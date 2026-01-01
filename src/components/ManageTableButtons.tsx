import { PaintBucket, Shuffle } from "lucide-react";
import IconButton from "@/elements/IconButton";

export default function ManageTableButtons() {
  return (
    <div className="flex space-x-10 my-7">
      <IconButton className="bg-(--primary-color) rounded-full p-3">
        <PaintBucket className="size-5" />
      </IconButton>
      <IconButton className="bg-(--primary-color) rounded-full p-3">
        <Shuffle className="size-5" />
      </IconButton>
    </div>
  );
}
