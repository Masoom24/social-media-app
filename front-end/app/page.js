"use client";

import LoginPage from "@/components/login/login-page";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const tokenid = localStorage.getItem("token");

    // Token missing? Redirect to login
    if (!tokenid) {
      router.push("/login");
    }
  }, []);
  return (
    <>
      <LoginPage />
    </>
  );
}
