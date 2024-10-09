"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";
import ImageInput from "../../../components/ImageInput";

export default function AddGraduate() {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    surname: "",
    passport: "",
    jshir: "",
    photo: "",
  });
  const [file, setFile] = useState(null);
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
  const handleUpload = async () => {
    if (!file) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploadphoto", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        return data.path;
      } else {
        setError(data.error || "Ошибка при загрузке файла.");
      }
    } catch (error) {
      setError("Ошибка сети или сервера.");
    }
  };
  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const photoPath = await handleUpload();

    if (photoPath) {
      formData.photo = photoPath;
    }

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
        setError("Xatolik: " + result.message);
      }
    } catch (error) {
      setError("Malumotlarni saqlashda xatolik yuz berdi.");
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
          <div className="flex sm:flex-row flex-col items-center gap-10">
            <ImageInput setFile={setFile} />
            <div className="w-full">
              <label className="label">
                <span className="label-text text-lg">Familiya</span>
              </label>
              <input
                type="text"
                name="lastname"
                placeholder="Familiya"
                className="input input-bordered text-xl w-full"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
              <label className="label">
                <span className="label-text text-lg">Ism</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ism"
                className="w-full input input-bordered text-xl"
                value={formData.name}
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
                className="input input-bordered text-xl w-full"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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

          {/* <label className="label">
            <span className="label-text text-lg">Sana</span>
          </label>
          <input
            type="date"
            name="graduationDate"
            className="input input-bordered text-xl"
            value={formData.graduationDate}
            onChange={handleChange}
            required
          /> */}
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
