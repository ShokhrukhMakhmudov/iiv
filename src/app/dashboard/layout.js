"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RootLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      fetch("/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            localStorage.removeItem("token");
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
      <header className="w-full   header bg-foreground text-background font-montMed shadow-lg border-b-2 border-white">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/dashboard" className="logo flex items-center gap-3">
            <img src="/iiv.png" alt="logo" width={60} height={60} />
            <p className="font-semibold text-white">
              ICHKI ISHLAR VAZIRLIGI <br /> MALAKA OSHIRISH INSTITUTI
            </p>
          </Link>
          <div className="flex gap-3">
            <Link href="/dashboard/addgraduate" className="btn btn-outline">
              Bitiruvchi qo'shish
            </Link>
            <Link href="/dashboard/addsertificate" className="btn btn-outline">
              Sertifikat qo'shish
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default RootLayout;