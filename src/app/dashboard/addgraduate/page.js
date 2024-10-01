"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";

export default function AddGraduate() {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    surname: "",
    passport: "",
    jshir: "",
    graduationDate: "",
    course: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  // Обработчик изменения значений полей формы
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/addgraduate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Bitiruvchi muvaffaqiyatli qo'shildi!");
        router.push("/dashboard");
      } else {
        setError("Ошибка: " + result.message);
      }
    } catch (error) {
      setError("Ошибка при отправке данных.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-10">
      <h1 className="text-4xl font-bold mb-5 text-center">
        Bitiruvchi qo'shish
      </h1>

      <form className="card-body max-w-[700px] mx-auto" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg">Ism</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Ism"
            className="input input-bordered text-xl "
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label className="label">
            <span className="label-text text-lg">Familiya</span>
          </label>
          <input
            type="text"
            name="lastname"
            placeholder="Familiya"
            className="input input-bordered text-xl "
            value={formData.lastname}
            onChange={handleChange}
            required
          />
          <label className="label">
            <span className="label-text text-lg">Otasining ismi</span>
          </label>
          <input
            type="text"
            name="surname"
            placeholder="Otasining ismi"
            className="input input-bordered text-xl "
            value={formData.surname}
            onChange={handleChange}
            required
          />
          <label className="label">
            <span className="label-text text-lg">Pasport seriya va raqami</span>
          </label>
          <input
            type="text"
            name="passport"
            className="input input-bordered text-xl"
            value={formData.passport}
            onChange={handleChange}
            placeholder="AA 1234567"
            maxLength={9}
            minLength={9}
            pattern="[A-Z]{2}[0-9]{7}"
            title="Pasport seriyasi 2 harf va 7 raqam bo'lishi kerak. Masalan: AA1234567"
            required
          />
          <label className="label">
            <span className="label-text text-lg">JSHIR</span>
          </label>
          <input
            name="jshir"
            type="text"
            placeholder="14 ta raqam"
            maxLength={14}
            minLength={14}
            regex="[0-9]{14}"
            pattern="[0-9]{14}"
            title="JSHIR 14 raqam bo'lishi kerak"
            className="input input-bordered text-xl"
            value={formData.jshir}
            onChange={handleChange}
            required
          />
          <label className="label">
            <span className="label-text text-lg">Kurs nomi:</span>
          </label>
          <select
            className="w-full select select-bordered text-xl"
            name="course"
            value={formData.course}
            defaultValue={"Kurs nomi"}
            onChange={handleChange}>
            <option value="Boshlang'ich">Boshlang'ich</option>
            <option value="Podpolkovnik">Podpolkovnik</option>
            <option value="Mayor">Mayor</option>
            <option value="Zaxira">Zaxira</option>
            <option value="Katta serjant">Katta serjant</option>
            <option value="Masofa malaka oshirish">
              Masofa malaka oshirish
            </option>
            <option value="Masofa qayta tayyorlash">
              Masofa qayta tayyorlash
            </option>
          </select>
          <label className="label">
            <span className="label-text text-lg">Sana</span>
          </label>
          <input
            type="date"
            name="graduationDate"
            className="input input-bordered text-xl"
            value={formData.graduationDate}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="form-control mt-6">
          <button className="btn btn-primary text-white text-lg">
            Qo'shish
          </button>
        </div>
      </form>
      {loading && <Loader />}
    </div>
  );
}
