"use client";
import AuthGuard from "@/components/AuthGuard";
import "./globals.css";
import SocketClient from "@/components/SocketClient";
import { useUserStore } from "@/store/useUserStore";

export default function RootLayout({ children }) {
  const userId = useUserStore((state) => state.user?._id); // ya state.userId

  return (
    <html lang="en">
      <body>
        <AuthGuard>
          <SocketClient userId={userId} /> {children}
        </AuthGuard>
      </body>
    </html>
  );
}
