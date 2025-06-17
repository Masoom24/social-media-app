"use client"; //  Important for client-side in App Router

import { useEffect } from "react";
import socket from "@/utils/socket";
import { useNotificationStore } from "@/store/useUserStore";

const SocketClient = ({ userId }) => {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (userId) {
      socket.emit("registerUser", userId);
    }

    socket.on("newPostNotification", (data) => {
      console.log("📩 New Notification:", data);
      addNotification(data);
    });

    return () => {
      socket.off("newPostNotification");
    };
  }, [userId]);

  return null;
};

export default SocketClient;
