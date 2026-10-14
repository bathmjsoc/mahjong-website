"use client";

import { createContext, type PropsWithChildren, use, useState } from "react";
import { Notification } from "@/elements/Notification";

type NotificationContextType = {
  notify: (title: string, message: string) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: PropsWithChildren) {
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  function notify(title: string, message: string) {
    setNotification({ isOpen: true, title, message });
  }

  function onClose() {
    setNotification((state) => ({ ...state, isOpen: false }));
  }

  return (
    <NotificationContext value={{ notify }}>
      {children}
      <Notification
        isOpen={notification.isOpen}
        onClose={onClose}
        title={notification.title}
      >
        {notification.message}
      </Notification>
    </NotificationContext>
  );
}

export function useNotificationContext(): NotificationContextType {
  const context = use(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a <NotificationProvider>!",
    );
  }

  return context;
}
