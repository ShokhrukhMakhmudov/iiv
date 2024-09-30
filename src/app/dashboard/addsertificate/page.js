"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
// import { updateGraduateCertificateCount } from "../../../actions/updateCount";
import Loader from "../../../components/Loader";

export default function AddCertificate() {
  const [graduatesOptions, setGraduatesOptions] = useState([]);
  const [selectedGraduate, setSelectedGraduate] = useState(null);
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    owner: "",
    certificateNumber: "",
    expirationDate: "",
  });

  const router = useRouter();

  useEffect(() => {
    async function fetchGraduates() {
      const response = await fetch("/api/addgraduate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const options = data.map((grad) => ({
        value: grad._id,
        label: grad.lastname + " " + grad.name + " " + grad.surname,
      }));
      setGraduatesOptions(options);
    }

    fetchGraduates();
  }, []);

  const handleGraduateChange = (selectedOption) => {
    setSelectedGraduate(selectedOption);
    setFormData({
      ...formData,
      owner: selectedOption ? selectedOption.value : "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Пожалуйста, выберите файл для загрузки.");
      return;
    }

    setLoading(true);
    const path = await handleUpload();

    const formDataToSend = {
      owner: formData.owner,
      certificateNumber: formData.certificateNumber,
      expirationDate: formData.expirationDate,
      file: path,
    };

    try {
      const res = await fetch("/api/certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        alert("Sertifikat yuklandi!");
        // await updateGraduateCertificateCount(formData.owner)
        //   .then((updatedGraduate) => {
        //     console.log("Данные выпускника обновлены:", updatedGraduate);
        //   })
        //   .catch(() => {
        //     alert("Ошибка:", "Не удалось обновить данные выпускника");
        //   })
        //   .finally(() => {
        //   });
        setFormData({
          owner: "",
          certificateNumber: "",
          expirationDate: "",
        });
        router.push("/dashboard");
      } else {
        setError(data.error || "Ошибка при загрузке файла.");
      }
    } catch (error) {
      setError("Ошибка сети или сервера.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-10">
      <h1 className="text-4xl font-bold mb-5 text-center">
        Sertifikat qo'shish
      </h1>

      <form className="card-body max-w-[700px] mx-auto" onSubmit={handleSubmit}>
        <div className="form-control">
          {/* Выпадающий список для выбора выпускника */}
          <Select
            className="text-xl "
            required
            name="owner"
            value={selectedGraduate}
            onChange={handleGraduateChange}
            options={graduatesOptions}
            placeholder="Bitiruvchini tanlang"
            isSearchable={true}
            isClearable={true}
            isMulti={false}
            styles={{
              menu: (base) => ({
                ...base,
                background: "#fff",
                color: "#000",
              }),
              option: (base) => ({
                ...base,
                background: "#fff",
                color: "#000",
                ":hover": {
                  background: "#1d232a",
                  color: "#fff",
                  cursor: "pointer",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                primary25: "#1d232a",
                primary: "#fff",
              },
            })}
          />

          {selectedGraduate && (
            <div>
              <h3>Выбранный выпускник: {selectedGraduate.label}</h3>
            </div>
          )}

          <label className="label">
            <span className="label-text text-lg">Sertifikat raqami</span>
          </label>
          <input
            type="text"
            name="certificateNumber"
            className="input input-bordered text-xl"
            value={formData.certificateNumber}
            onChange={handleChange}
            placeholder="Sertifikat raqami"
            required
          />
          <label className="label">
            <span className="label-text text-lg">Sana:</span>
          </label>
          <input
            type="date"
            name="expirationDate"
            className="input input-bordered text-xl"
            value={formData.expirationDate}
            onChange={handleChange}
            required
          />

          {/* Загрузка файла */}
          <label className="label">
            <span className="label-text text-lg">Faylni yuklash</span>
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            name="file"
            className="file-input file-input-bordered w-full max-w-xs"
          />
        </div>

        <div className="form-control mt-6">
          <button className="btn btn-primary">Qo'shish</button>
        </div>

        {filePath && <p>Файл успешно загружен. Путь: {filePath}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      {loading && <Loader />}
    </div>
  );
}
