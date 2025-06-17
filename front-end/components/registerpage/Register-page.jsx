"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent,  SelectValue,   SelectItem, SelectTrigger } from "../ui/select";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      router.push("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
     <div className="max-w-md mx-auto mt-10 p-8 rounded-xl shadow-lg bg-[#F1F1F2] border border-bg-[#F1F1F2] ">
  <div className="w-full max-w-md bg-[#F1F1F2]   rounded-xl p-8">
    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
      Create an Account
    </h2>
    <Input 
      placeholder="Name"
      className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#A1D6E2]"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
    />

    <Input
      placeholder="Email"
      className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#A1D6E2]"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
    />

    <Input
      placeholder="Password"
      type="password"
      className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#A1D6E2]"
      value={form.password}
      onChange={(e) => setForm({ ...form, password: e.target.value })}
    />

    <Select
      value={form.role}
      onValueChange={(value) => setForm({ ...form, role: value })}
    >
      <SelectTrigger className="w-full border border-gray-300 p-3 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-[#A1D6E2]">
        <SelectValue placeholder="Select Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public">Public</SelectItem>
        <SelectItem value="celebrity">Celebrity</SelectItem>
      </SelectContent>
    </Select>

    <Button
      onClick={handleRegister}
      className="w-full bg-[#A1D6E2] text-white font-medium py-2.5 rounded-md hover:bg-[#91cbd8] transition duration-200"
    >
      Register
    </Button>

    <p className="mt-6 text-sm text-center text-gray-700">
      Already have an account?{" "}
      <span
        onClick={() => router.push("/login")}
        className="text-[#05caf7] hover:underline cursor-pointer font-medium"
      >
        Login
      </span>
    </p>
  </div>
</div>

  );
}
