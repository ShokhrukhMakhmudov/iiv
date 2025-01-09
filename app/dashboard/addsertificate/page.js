"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
// import { updateGraduateCertificateCount } from "../../../actions/updateCount";
import Loader from "../../../components/Loader";

export default function AddCertificate() {
  const [graduatesOptions, setGraduatesOptions] = useState([]);
  const [certificatesOptions, setCertificatesOptions] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedGraduate, setSelectedGraduate] = useState(null);
  const [filterCertificates, setFilterCertificates] = useState("all");
  const [file, setFile] = useState("");
  const [filePath, setFilePath] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    owner: "",
    certificateNumber: "",
    date: "",
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

    async function fetchCertificates() {
      const response = await fetch("/api/certificate?owner=unknown", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const options = data.map((grad) => ({
        value: grad._id,
        label: grad.file.slice(9),
        course: grad.course,
      }));
      setCertificatesOptions(options);
    }

    fetchGraduates();
    fetchCertificates();
  }, []);

  const handleGraduateChange = (selectedOption) => {
    setSelectedGraduate(selectedOption);
    setFormData({
      ...formData,
      owner: selectedOption ? selectedOption.value : "",
    });
  };

  const handleCertificateChange = (selectedOption) => {
    setSelectedCertificate(selectedOption);
    setFormData({
      ...formData,
      certificate: selectedOption ? selectedOption.value : "",
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

    setLoading(true);

    if (!file && !selectedCertificate?.value) {
      setLoading(false);
      return setError("Fayl tanlanmadi!");
    }

    if (selectedCertificate) {
      const formDataToSend = {
        owner: formData.owner,
        certificateNumber: formData.certificateNumber,
        date: formData.date,
        file: selectedCertificate.value,
      };

      try {
        const res = await fetch("/api/certificate/update", {
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
    } else {
      const path = await handleUpload();

      const formDataToSend = {
        owner: formData.owner,
        certificateNumber: formData.certificateNumber,
        date: formData.date,
        file: path,
        course: formData.course,
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

          setFormData({
            owner: "",
            certificateNumber: "",
            date: "",
            course: "",
          });
          router.push("/dashboard");
        } else {
          setError(data.error || "Faylni yuklashda xatolik.");
        }
      } catch (error) {
        setError("Tarmoq yoki serverda xatolik!");
      }
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
              <h3>Bitiruvchi: {selectedGraduate.label}</h3>
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
            name="date"
            className="input input-bordered text-xl mb-5"
            value={formData.date}
            onChange={handleChange}
            required
          />
          {!file && (
            <div className="w-full flex gap-5">
              <Select
                className="text-xl w-full"
                required
                name="owner"
                value={selectedCertificate}
                onChange={handleCertificateChange}
                options={
                  certificatesOptions &&
                  certificatesOptions.filter((item) =>
                    filterCertificates === "all"
                      ? true
                      : item.course.toLowerCase() ===
                        filterCertificates.toLowerCase()
                  )
                }
                placeholder="Sertifikatni tanlang"
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
              <select
                className="select select-bordered text-xl text-white text-center max-w-[200px]"
                name="course"
                value={filterCertificates}
                onChange={(e) => setFilterCertificates(e.target.value)}
                required>
                <option value="all">Barchasi</option>
                <option value="Masofa malaka oshirish">
                  Masofa malaka oshirish
                </option>
                <option value="Masofa qayta tayyorlash">
                  Masofa qayta tayyorlash
                </option>
                <option value="Boshlang'ich">Boshlang'ich</option>
                <option value="Podpolkovnik">Podpolkovnik</option>
                <option value="Mayor">Mayor</option>
                <option value="Zaxira">Zaxira</option>
                <option value="Katta serjant">Katta serjant</option>
              </select>
            </div>
          )}
          {selectedCertificate && (
            <div>
              <h3 className="mt-5">Kurs nomi: {selectedCertificate.course}</h3>
            </div>
          )}
          {/* Загрузка файла */}
          {!selectedCertificate && (
            <>
              <label className="label">
                <span className="label-text text-lg">Faylni yuklash</span>
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                name="file"
                className="file-input file-input-bordered w-full max-w-xs"
              />
            </>
          )}

          {file && (
            <>
              <label className="label">
                <span className="label-text text-lg">Kurs nomi:</span>
              </label>
              <select
                className="select select-bordered text-xl text-white text-center"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required>
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
            </>
          )}
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
