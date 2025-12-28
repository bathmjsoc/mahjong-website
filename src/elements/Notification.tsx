import { Transition } from "@headlessui/react";
import { type ReactNode, useEffect } from "react";

type NotificationProps = {
  isOpen: boolean;
  close: () => void;
  title: string;
  children: ReactNode;
  duration?: number;
};

export default function Notification({
  isOpen,
  close,
  title,
  children,
  duration = 3000,
}: NotificationProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(close, duration);
    return () => clearTimeout(timer);
  }, [isOpen, close, duration]);

  return (
    <Transition
      show={isOpen}
      enter="transition duration-300"
      enterFrom="translate-y-2 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed bottom-5 right-5 z-99">
        <div
          className="
          bg-(--secondary-color) text-(--primary-color)
          border-(--primary-color) border-2
          w-xs rounded-lg p-3 shadow-xl
        "
        >
          <div className="font-bold text-md mb-2">{title}</div>
          <div className="text-xs">{children}</div>
        </div>
      </div>
    </Transition>
  );
}
