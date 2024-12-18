"use client";
import { useState } from "react";
import Loader from "../Loader";

export default function UploadCertificates() {
  const [files, setFiles] = useState([]);
  const [course, setCourse] = useState("Masofa malaka oshirish");

  const [loading, setLoading] = useState(false);
  // Обработчик изменения файлов
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSelect = (e) => {
    setCourse(e.target.value);
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Выберите файлы для загрузки.");
      return;
    }

    const formData = new FormData();

    // Добавляем файлы в formData
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    formData.append("course", course);
    try {
      setLoading(true);
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData, // Отправляем файлы
      });

      const result = await response.json();

      if (result.success) {
        alert(`Загружено сертификатов: ${result.certificates.length}`);
      } else {
        alert("Ошибка: " + result.message);
      }
    } catch (error) {
      console.error("Ошибка при загрузке файлов:", error);
      alert("Ошибка при загрузке файлов.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="container mt-10">
        <h1 className="text-4xl font-bold mb-5 text-center">
          Sertifikatlarni yuklash
        </h1>

        <form
          className="card-body max-w-[700px] mx-auto"
          onSubmit={handleSubmit}>
          <div className="form-control ">
            <label className="label">
              <span className="label-text text-lg">Fayl tanlang:</span>
            </label>
            <input
              type="file"
              multiple
              className="input input-bordered text-xl mb-5"
              onChange={handleFileChange}
              required
            />
            <label className="label">
              <span className="label-text text-lg">Kurs nomi:</span>
            </label>
            <select
              className="select select-bordered text-xl text-white text-center"
              name="course"
              value={course}
              onChange={handleSelect}
              required>
              <option value="Masofadan malaka oshirish">
                Masofadan malaka oshirish
              </option>
              <option value="Masofadan qayta tayyorlash">
                Masofadan qayta tayyorlash
              </option>
              <option value="Boshlang'ich">Boshlang'ich</option>
              <option value="Podpolkovnik">Podpolkovnik</option>
              <option value="Mayor">Mayor</option>
              <option value="Zaxira">Zaxira</option>
              <option value="Katta serjant">Katta serjant</option>
            </select>
          </div>

          <div className="form-control mt-6">
            <button className="btn btn-primary text-xl">Faylni yuklash</button>
          </div>
        </form>
      </div>
      {loading && <Loader />}
    </>
  );
}
