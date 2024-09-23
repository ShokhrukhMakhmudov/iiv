// app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../components/Loader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);

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
              className="border px-3 py-2 rounded-lg text-xl mb-5 bg-white outline-[#c1c1c1] text-black"
              type="email"
              placeholder="Login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="relative mb-5">
              <input
                className="w-full border px-3 py-2 rounded-lg text-xl  bg-white outline-[#c1c1c1] text-black"
                type={showPassword ? "text" : "password"}
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 512 512"
                    height="25px"
                    width="25px"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle cx="256" cy="256" r="64"></circle>
                    <path d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 252 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72 38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76zM256 352a96 96 0 1 1 96-96 96.11 96.11 0 0 1-96 96z"></path>
                  </svg>
                ) : (
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 512 512"
                    height="25"
                    width="25"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM248 315.85l-51.79-51.79a2 2 0 00-3.39 1.69 64.11 64.11 0 0053.49 53.49 2 2 0 001.69-3.39zm16-119.7L315.87 248a2 2 0 003.4-1.69 64.13 64.13 0 00-53.55-53.55 2 2 0 00-1.72 3.39z"
                      stroke="none"
                    />
                    <path
                      d="M491 273.36a32.2 32.2 0 00-.1-34.76c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.68 96a226.54 226.54 0 00-71.82 11.79 4 4 0 00-1.56 6.63l47.24 47.24a4 4 0 003.82 1.05 96 96 0 01116 116 4 4 0 001.05 3.81l67.95 68a4 4 0 005.4.24 343.81 343.81 0 0067.24-77.4zM256 352a96 96 0 01-93.3-118.63 4 4 0 00-1.05-3.81l-66.84-66.87a4 4 0 00-5.41-.23c-24.39 20.81-47 46.13-67.67 75.72a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.39 76.14 98.28 100.65C162.06 402 207.92 416 255.68 416a238.22 238.22 0 0072.64-11.55 4 4 0 001.61-6.64l-47.47-47.46a4 4 0 00-3.81-1.05A96 96 0 01256 352z"
                      stroke="none"
                    />
                  </svg>
                )}
              </button>
            </label>
            <button
              type="submit"
              className="border px-3 py-2 rounded-lg text-xl mb-5 text-black  bg-[#f6f6f6] hover:bg-[#ffffff8a] active:opacity-50">
              Kirish
            </button>
          </form>
          {error && <p>{error}</p>}
        </div>
      </div>
      {loading && <Loader />}
    </section>
  );
}
