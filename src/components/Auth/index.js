"use client";
import { useRef } from "react";

export default function Auth() {
  const passport = useRef(null);
  const jshir = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      passport: passport.current.value,
      jshir: jshir.current.value,
    });
  };
  return (
    <section className="">
      <div className="container">
        <div className="flex items-center justify-center border gap-10 p-5">
          <img
            className="hidden md:block"
            src="/user.png"
            alt="user image"
            width={250}
          />
          <form className="flex flex-col font-mont" onSubmit={handleSubmit}>
            <h3 className="text-2xl font-bold mb-5">
              Pasport/Id karta ma'lumotlari
            </h3>
            <label htmlFor="passport">Pasport seriyasi va raqami</label>
            <input
              ref={passport}
              className="border px-3 py-2 rounded-xl text-xl mb-5 outline-[#c1c1c1]"
              type="text"
              placeholder="AA 1234567"
              id="passport"
              required
              maxLength={9}
              minLength={9}
              pattern="[A-Z]{2}[0-9]{7}"
              title="Pasport seriyasi 2 harf va 7 raqam bo'lishi kerak. Masalan: AA1234567"
            />
            <label htmlFor="jshir">JSHIR</label>
            <input
              ref={jshir}
              className="border px-3 py-2 rounded-xl text-xl outline-[#c1c1c1]"
              type="text"
              placeholder="14 ta raqam"
              id="jshir"
              maxLength={14}
              minLength={14}
              regex="[0-9]{14}"
              required
              pattern="[0-9]{14}"
              title="JSHIR 14 raqam bo'lishi kerak"
            />
            <button
              type="submit"
              className="inline-block mt-5 border py-2 px-4 rounded-xl text-xl bg-white hover:bg-[#ffffff8a] active:opacity-50">
              Sertifikat olish
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
