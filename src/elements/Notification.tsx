import { Transition } from "@headlessui/react";
import { type ReactNode, useEffect } from "react";

type NotificationProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  duration?: number;
};

export function Notification({
  isOpen,
  title,
  children,
  onClose,
  duration = 5000,
}: NotificationProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);

  return (
    <Transition
      enter="transition duration-300"
      enterFrom="translate-y-2 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show={isOpen}
    >
      <div className="fixed right-5 bottom-5 z-99">
        <div className="border-primary bg-secondary text-primary w-xs rounded-lg border-2 p-3">
          <div className="text-md mb-2 font-bold">{title}</div>
          <div className="text-xs">{children}</div>
        </div>
      </div>
    </Transition>
  );
}
