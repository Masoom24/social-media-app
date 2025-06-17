"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.clear(); // Clear old session
      localStorage.setItem("token", res.data.token);

      setUser(res.data.user);
      if (res.data.user.role === "celebrity") router.push("/celebrity");
      else router.push("/public");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 rounded-xl shadow-lg bg-[#F1F1F2] border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Login
      </h2>

      <Input
        placeholder="Email"
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#A1D6E2]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-[#A1D6E2]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        onClick={handleLogin}
        className="w-full bg-[#A1D6E2] text-white font-medium py-2.5 rounded-md hover:bg-[#91cbd8] transition duration-200"
      >
        Login
      </Button>

      <div className="mt-6 text-center text-sm text-gray-700">
        <p>
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/registration")}
            className="text-[#05caf7] hover:underline cursor-pointer font-medium"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
