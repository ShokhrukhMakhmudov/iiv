"use client";
import { useState } from "react";

export default function UploadCertificates() {
  const [files, setFiles] = useState([]);

  // Обработчик изменения файлов
  const handleFileChange = (e) => {
    setFiles(e.target.files);
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

    try {
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
  };

  return (
    <div className="container mt-10">
      <h1 className="text-4xl font-bold mb-5 text-center">
        Sertifikatlarni yuklash
      </h1>

      <form className="card-body max-w-[700px] mx-auto" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg">Выберите файлы</span>
          </label>
          <input
            type="file"
            multiple
            className="input input-bordered text-xl"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-control mt-6">
          <button className="btn btn-primary">Загрузить файлы</button>
        </div>
      </form>
    </div>
  );
}
