import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "@/elements/IconButton";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogBackdrop
        className="fixed inset-0 bg-black/33 backdrop-blur-xs transition duration-300 data-closed:opacity-0"
        transition
      />

      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel
          className="rounded-xl bg-primary p-4 text-secondary transition duration-300 data-closed:scale-95 data-closed:opacity-0"
          transition
        >
          <div className="mb-4 flex items-center justify-between">
            <DialogTitle className="font-bold text-lg">{title}</DialogTitle>
            <IconButton className="hover:text-negative" onClick={onClose}>
              <X />
            </IconButton>
          </div>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
