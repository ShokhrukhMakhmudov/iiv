"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../../../components/Loader";
import ImageInput from "../../../../components/ImageInput";
import Image from "next/image";

export default function page({ params }) {
  const graduateId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
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

  useEffect(() => {
    fetch(`/api/addgraduate?id=${graduateId}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          id: data[0]?._id,
          name: data[0]?.name,
          lastname: data[0]?.lastname,
          surname: data[0]?.surname,
          passport: data[0]?.passport,
          jshir: data[0]?.jshir,
          photo: data[0]?.photo,
        });
        setIsLoading(false);
      });
  }, [graduateId]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
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
      const response = await fetch("/api/updategraduate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Bitiruvchi muvaffaqiyatli o'zgartirildi!");
    
      } else {
        setError("Xatolik: " + result.message);
      }
    } catch (error) {
      setError("Malumotlarni saqlashda xatolik yuz berdi.");
    }
    setLoading(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mt-10">
      <h1 className="text-4xl font-bold mb-5 text-center">
        Bitiruvchi tahrirlash
      </h1>

      <form className="card-body max-w-[700px] mx-auto" onSubmit={handleSubmit}>
        <div className="form-control">
          <div className="flex sm:flex-row flex-col items-center gap-10">
            {!formData.photo && <ImageInput setFile={setFile}/>}
            {formData.photo && <div className="relative flex flex-col items-center justify-center rounded-xl min-w-[200px] min-h-[245px]">
              {!file && <img
                className="w-[200px] h-[245px] object-cover rounded-xl"
                width={200}
                height={245}
                src={`${formData.photo}`}
                alt="rasm"
              />}
              <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 z-10">
                <ImageInput setFile={setFile} photo={formData.photo}/>
              </div>
            </div>}
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
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="form-control mt-6">
          <button className="btn btn-primary text-white text-lg">
            O'zgartirish
          </button>
        </div>
      </form>
      {loading && <Loader />}
    </div>
  );
}
