"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Если токена нет, перенаправляем на страницу логина
    } else {
      // Выполняем запрос к защищенному API
      fetch("/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            localStorage.removeItem("token"); // Если ошибка, удаляем токен и перенаправляем
            router.push("/login");
          } else {
            setUserData(data);
            setIsLoading(false);
          }
        });
    }
  }, [router]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>Добро пожаловать, {userData?.userId}</h1>
    </div>
  );
};

export default page;
