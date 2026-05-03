"use client";

import { useState } from "react";
import { loginUser } from "@/lib/services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const data = await loginUser(email, password);

    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user.id);
      window.location.href = "/dashboard";
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="email" onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="password" onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}