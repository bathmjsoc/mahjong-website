import { PaintBucket, Shuffle } from "lucide-react";
import IconButton from "@/elements/IconButton";

const MANAGE_TABLE_BUTTON_CLASS = "bg-(--primary-color) rounded-full p-3";

export default function ManageTableButtons() {
  return (
    <div className="flex space-x-10 my-7">
      <IconButton className={MANAGE_TABLE_BUTTON_CLASS}>
        <PaintBucket className="size-5" />
      </IconButton>
      <IconButton className={MANAGE_TABLE_BUTTON_CLASS}>
        <Shuffle className="size-5" />
      </IconButton>
    </div>
  );
}
