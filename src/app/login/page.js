// app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Ошибка авторизации");
    }
  };

  return (
    <section className="loginPage">
      <div className="container h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center border py-5 rounded-xl shadow-2xl px-10 backdrop-filter backdrop-blur">
          <h2 className="text-2xl font-bold mb-5 text-white">Avtorizatsiya</h2>
          <form className="flex flex-col  w-[400px]" onSubmit={handleLogin}>
            <input
              className="border px-3 py-2 rounded-lg text-xl mb-5 outline-[#c1c1c1]"
              type="email"
              placeholder="Login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="border px-3 py-2 rounded-lg text-xl mb-5 outline-[#c1c1c1]"
              type="password"
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="border px-3 py-2 rounded-lg text-xl mb-5  bg-[#f6f6f6] hover:bg-[#ffffff8a] active:opacity-50">
              Kirish
            </button>
          </form>
          {error && <p>{error}</p>}
        </div>
      </div>
    </section>
  );
}
