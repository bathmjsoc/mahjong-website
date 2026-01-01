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
    <Dialog open={isOpen} onClose={onClose}>
      <DialogBackdrop
        transition
        className="
          fixed inset-0 bg-black/33 backdrop-blur-xs
          transition duration-300 data-closed:opacity-0
        "
      />

      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel
          transition
          className="
            bg-(--primary-color) text-(--secondary-color)
            rounded-xl p-4 transition duration-300
            data-closed:scale-95 data-closed:opacity-0
          "
        >
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
            <IconButton
              onClick={onClose}
              className="hover:text-(--negative-color)"
            >
              <X />
            </IconButton>
          </div>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
