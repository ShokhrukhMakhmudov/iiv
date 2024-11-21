"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { FormatDate } from "../../components/FormatDate";
import Image from "next/image";
import Link from "next/link";
import Loader from "../../components/Loader";

export default function page() {
  const search = useRef(null);
  const searchCertificates = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [graduates, setGraduates] = useState(null);
  const [tab, setTab] = useState(false);
  const [sort, setSort] = useState("all");
  const [filteredGraduates, setFilteredGraduates] = useState(null);
  const [filteredCertificates, setFilteredCertificates] = useState(null);
  const [certificates, setCertificates] = useState(null);

  useEffect(() => {
    async function getGraduates() {
      const response = await fetch("/api/addgraduate");
      const data = await response.json();
      setGraduates(data);
    }
    getGraduates();

    async function getCertificates() {
      const response = await fetch("/api/certificate");
      const data = await response.json();
      setCertificates(data);
    }
    getCertificates();
  }, []);

  function filterData(type) {
    if (type === "all") {
      setFilteredGraduates(null);
      return;
    }

    const filtered = graduates.filter((graduate) => {
      return graduate.course === type;
    });
    search.current.value = "";
    setFilteredGraduates(filtered);
  }

  function sortData(type) {
    console.log(type);

    if (type === "all") {
      setSort("all");
      setFilteredGraduates(null);
      return;
    } else if (type === "date") {
      if (filteredGraduates) {
        const sorted = filteredGraduates.sort((a, b) => {
          return new Date(a.graduationDate) - new Date(b.graduationDate);
        });
        setFilteredGraduates(sorted);
        setSort("date");
      } else {
        setGraduates((old) =>
          old.sort((a, b) => {
            return new Date(a.graduationDate) - new Date(b.graduationDate);
          })
        );
        setSort("date");
      }
    } else if (type === "name") {
      if (filteredGraduates) {
        const sorted = filteredGraduates.sort((a, b) => {
          return a.lastname.localeCompare(b.lastname);
        });
        setFilteredGraduates(sorted);
        setSort("name");
      } else {
        const sorted = [...graduates].sort((a, b) => {
          return a.lastname
            .toLowerCase()
            .localeCompare(b.lastname.toLowerCase());
        });
        setFilteredGraduates(sorted);

        setSort("name");
      }
    }
  }

  function handleSearchCertificates(e) {
    e.preventDefault();
    const searchText = searchCertificates.current.value.toLowerCase();

    if (searchText === "") {
      setFilteredCertificates(null);
      return;
    }

    const filtered = certificates.filter((certificate) => {
      return certificate?.certificateNumber
        ? certificate?.certificateNumber.toLowerCase().includes(searchText)
        : false;
    });

    setFilteredCertificates(filtered);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const searchText = search.current.value.toLowerCase();

    const filtered = graduates.filter((graduate) => {
      const fullname =
        graduate.name + " " + graduate?.lastname + " " + graduate?.surname;

      return fullname.toLowerCase().includes(searchText);
    });

    setFilteredGraduates(filtered);
  }

  function showPhoto(photoPath) {
    document.getElementById("modalPhoto").showModal();
    document.getElementById("modalImg").src = photoPath;
  }

  function showCertificate(data) {
    document.getElementById("certificateNumber").innerText =
      data.certificateNumber ?? data.file.slice(9);
    document.getElementById("certificateCourse").innerText = data.course;
    document.getElementById("certificateDate").innerText = data.date
      ? FormatDate(data.date)
      : "Berilmagan";
    document.getElementById("certificateLink").href = data?.file;
    document.getElementById("deleteCertificate").dataset.id = data._id;

    const owner =
      graduates && graduates.find((graduate) => graduate._id === data.owner);

    if (owner) {
      document.getElementById(
        "certificateOwner"
      ).innerText = `${owner?.lastname} ${owner?.name} ${owner?.surname}`;
      document.getElementById("certificateOwnerPhoto").src = owner?.photo;
    } else {
      document.getElementById("certificateOwner").innerText = `Berilmagan`;
      document.getElementById("certificateOwnerPhoto").style.display = "none";
    }

    document.getElementById("modalCertificate").showModal();
  }

  const certificateCounts = useMemo(() => {
    const counts = {};
    certificates?.forEach((certificate) => {
      {
        if (certificate.course) {
          if (!counts[certificate.course]) {
            counts[certificate.course] = 1;
          } else {
            counts[certificate.course]++;
          }
        }
      }
    });
    return counts;
  }, [certificates]);

  async function deleteCertificate(e) {
    const id = e.target.getAttribute("data-id");
    setIsLoading(true);
    const response = await fetch("/api/certificate?id=" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.success) {
      alert("Sertifikat muvaffaqiyatli o'chirildi");
      window.location.reload();
    } else {
      alert(data.message);
    }

    setIsLoading(false);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container mt-10">
        <div className="stats stats-mobile w-full shadow shadow-black mb-10 mx-auto">
          <div className="stat place-items-center">
            <div className="stat-title font-bold">Bitiruvchilar</div>
            <div className="stat-value">{graduates?.length ?? 0}</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title text-xl font-bold">Sertifikatlar</div>
            <div className="stat-value text-primary">
              {certificates?.length ?? 0}
            </div>
          </div>
        </div>
        <div className="stats stats-mobile w-full flex flex-col sm:flex-row shadow shadow-black mb-10 text-black">
          {certificateCounts &&
            Object.keys(certificateCounts)
              .reverse()
              .map((key) => (
                <div className="stat place-items-center" key={key}>
                  <div className="stat-value">{certificateCounts[key]}</div>
                  <div className="stat-title text-lg break-words">{key}</div>
                </div>
              ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-5 mb-10 text-black font-bold ">
          <button
            className="w-[49%] btn btn-outline text-xl"
            style={tab ? {} : { background: "#fff", color: "#000" }}
            onClick={() => setTab(false)}>
            Bitiruvchilar
          </button>
          <button
            className="w-[49%] btn btn-outline text-xl"
            style={tab ? { background: "#fff", color: "#000" } : {}}
            onClick={() => setTab(true)}>
            Sertifikatlar
          </button>
        </div>
        {!tab && (
          <>
            <div className="mb-5 px-2 sm:px-0">
              <form
                className="flex justify-between gap-5"
                onSubmit={handleSubmit}>
                <label className="w-full input input-bordered flex items-center gap-2">
                  <input
                    ref={search}
                    id="search"
                    type="text"
                    className="grow"
                    placeholder="Bitiruvchini izlash..."
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
                <button className="btn btn-outline" type="submit">
                  Qidirish
                </button>
              </form>
            </div>
            <div>
              <table className="table w-full text-xl">
                {/* head */}
                <thead>
                  <tr className="text-lg">
                    <th></th>
                    <th>
                      <label
                        htmlFor="name"
                        className={
                          (sort === "name" ? "btn-outline " : "") +
                          "select-none cursor-pointer btn"
                        }>
                        Ism
                      </label>
                      <input
                        id="name"
                        name="sort"
                        type="checkbox"
                        className="appearance-none"
                        onChange={(e) =>
                          e.target.checked ? sortData("name") : sortData("all")
                        }
                      />
                    </th>
                    <th className="text-center">
                      <label
                        htmlFor="date"
                        className={
                          (sort === "date" ? "btn-outline " : "") +
                          "select-none cursor-pointer btn"
                        }>
                        Rasm
                      </label>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGraduates &&
                    filteredGraduates.map((graduate, index) => (
                      <tr key={graduate?._id}>
                        <th>{index + 1}</th>
                        <td>
                          <Link
                            className="hover:underline"
                            href={`dashboard/editgraduate/${graduate?._id}`}>
                            {graduate?.lastname +
                              " " +
                              graduate?.name +
                              " " +
                              graduate?.surname}
                          </Link>
                        </td>
                        <td className="text-center">
                          {graduate?.photo ? (
                            <div
                              className="relative w-fit h-fit mx-auto rounded-xl overflow-hidden"
                              onMouseEnter={(e) => {
                                if (e.target.parentElement.children[1])
                                  e.target.parentElement.children[1].style.display =
                                    "flex";
                              }}
                              onMouseLeave={(e) => {
                                if (e.target.parentElement.children[1])
                                  e.target.parentElement.children[1].style.display =
                                    "none";
                              }}>
                              <img
                                className="h-[135px] w-[105px] object-cover object-center"
                                width={105}
                                height={135}
                                src={graduate?.photo}
                                alt="graduate photo"
                              />
                              <span
                                className="absolute top-0 right-0 w-full h-full flex items-center justify-center bg-[#00000075] backdrop-blur-sm cursor-pointer"
                                style={{ display: "none" }}
                                onClick={() => showPhoto(graduate.photo)}>
                                <svg
                                  stroke="#fff"
                                  fill="#fff"
                                  strokeWidth="0"
                                  viewBox="0 0 512 512"
                                  height="25px"
                                  width="25px"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="256" cy="256" r="64"></circle>
                                  <path
                                    d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 252 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72 38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76zM256 352a96 96 0 1 1 96-96 96.11 96.11 0 0 1-96 96z"
                                    style={{ display: "block" }}></path>
                                </svg>
                              </span>
                            </div>
                          ) : (
                            <svg
                              className="mx-auto"
                              stroke="#eee"
                              fill="#eee"
                              strokeWidth="0"
                              viewBox="0 0 448 512"
                              height="120px"
                              width="90px"
                              xmlns="http://www.w3.org/2000/svg">
                              <path d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8zM13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3 0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57 0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6z"></path>
                            </svg>
                          )}
                          {/* {FormatDate(graduate.graduationDate)} */}
                        </td>
                        {/* <td className="text-center">{graduate?.course}</td> */}
                      </tr>
                    ))}
                  {graduates &&
                    !filteredGraduates &&
                    graduates.map((graduate, index) => (
                      <tr key={graduate?._id}>
                        <th>{index + 1}</th>
                        <td>
                          <Link
                            className="hover:underline"
                            href={`dashboard/editgraduate/${graduate?._id}`}>
                            {graduate?.lastname +
                              " " +
                              graduate?.name +
                              " " +
                              graduate?.surname}
                          </Link>
                        </td>
                        <td className="text-center">
                          {graduate?.photo ? (
                            <div
                              className="relative w-fit h-fit mx-auto rounded-xl overflow-hidden"
                              onMouseEnter={(e) => {
                                if (e.target.parentElement.children[1])
                                  e.target.parentElement.children[1].style.display =
                                    "flex";
                              }}
                              onMouseLeave={(e) => {
                                if (e.target.parentElement.children[1])
                                  e.target.parentElement.children[1].style.display =
                                    "none";
                              }}>
                              <img
                                className="h-[135px] w-[105px] object-cover object-center "
                                src={graduate.photo}
                                alt="graduate photo"
                              />
                              <span
                                className="absolute top-0 right-0 w-full h-full flex  items-center justify-center bg-[#00000075] backdrop-blur-sm cursor-pointer"
                                style={{ display: "none" }}
                                onClick={() => showPhoto(graduate.photo)}>
                                <svg
                                  stroke="#fff"
                                  fill="#fff"
                                  strokeWidth="0"
                                  viewBox="0 0 512 512"
                                  height="25px"
                                  width="25px"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="256" cy="256" r="64"></circle>
                                  <path d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 252 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72 38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76zM256 352a96 96 0 1 1 96-96 96.11 96.11 0 0 1-96 96z"></path>
                                </svg>
                              </span>
                            </div>
                          ) : (
                            <svg
                              className="mx-auto"
                              stroke="#eee"
                              fill="#eee"
                              strokeWidth="0"
                              viewBox="0 0 448 512"
                              height="120px"
                              width="90px"
                              xmlns="http://www.w3.org/2000/svg">
                              <path d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8zM13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3 0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57 0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6z"></path>
                            </svg>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab && (
          <>
            <div className="mb-5 px-2 sm:px-0">
              <form
                className="flex justify-between gap-5"
                onSubmit={handleSearchCertificates}>
                <label className="w-full input input-bordered flex items-center gap-2">
                  <input
                    ref={searchCertificates}
                    id="search"
                    type="text"
                    className="grow"
                    placeholder="Sertifikatni izlash..."
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
                <button className="btn btn-outline" type="submit">
                  Qidirish
                </button>
              </form>
            </div>
            <div>
              <table className="table w-full text-xl">
                {/* head */}
                <thead>
                  <tr className="text-lg">
                    <th></th>
                    <th>
                      <label
                        htmlFor="name"
                        className={
                          (sort === "name" ? "btn-outline " : "") +
                          "select-none cursor-pointer btn"
                        }>
                        Raqam / Fayl nomi
                      </label>
                      <input
                        id="name"
                        name="sort"
                        type="checkbox"
                        className="appearance-none"
                        onChange={(e) =>
                          e.target.checked ? sortData("name") : sortData("all")
                        }
                      />
                    </th>
                    <th className="text-center">Kurs nomi</th>
                    <th className="text-center">Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates &&
                    filteredCertificates.map((certificate, index) => (
                      <tr key={certificate?._id}>
                        <th>{index + 1}</th>
                        <td
                          className="cursor-pointer"
                          onClick={() => showCertificate(certificate)}>
                          {certificate.certificateNumber ??
                            certificate.file.slice(9)}
                        </td>
                        <td className="text-center">{certificate.course}</td>
                        <td className="text-center">
                          {certificate.date
                            ? FormatDate(certificate.date)
                            : "Faol emas"}
                        </td>
                      </tr>
                    ))}
                  {certificates &&
                    !filteredCertificates &&
                    certificates.map((certificate, index) => (
                      <tr key={certificate?._id}>
                        <th>{index + 1}</th>
                        <td
                          className="cursor-pointer"
                          onClick={() => showCertificate(certificate)}>
                          {certificate.certificateNumber ??
                            certificate.file.slice(9)}
                        </td>
                        <td className="text-center">{certificate.course}</td>
                        <td className="text-center">
                          {certificate.date
                            ? FormatDate(certificate.date)
                            : "Faol emas"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal Photo */}
      <dialog id="modalPhoto" className="modal">
        <div className="modal-box w-fit">
          <img
            id="modalImg"
            className="h-[135px] w-[105px] object-cover object-center "
            src=""
            style={{ zoom: 3 }}
            alt="graduate photo"
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Yopish</button>
        </form>
      </dialog>

      {/* Modal Certificate */}
      <dialog id="modalCertificate" className="modal">
        <div className="modal-box w-fit sm:text-2xl">
          <div className="flex justify-between mb-5">
            <div className="flex flex-col gap-5 ">
              <p>
                Raqam/Fayl:{" "}
                <span className="text-white" id="certificateNumber"></span>
              </p>
              <p>
                Kurs nomi:{" "}
                <span className="text-white" id="certificateCourse"></span>
              </p>
              <p>
                Sana: <span className="text-white" id="certificateDate"></span>
              </p>
            </div>

            <img
              id="certificateOwnerPhoto"
              className="h-[135px] w-[105px] object-cover object-center border"
              src=""
              alt="graduate photo"
            />
          </div>
          <p>
            Bitiruvchi:{" "}
            <span className="text-white" id="certificateOwner"></span>
          </p>
          <div className="flex justify-end gap-5 mt-5">
            <a
              id="certificateLink"
              target="_blank"
              download
              href=""
              className="btn btn-outline border-none text-white text-lg bg-blue-600">
              Yuklash
            </a>
            <button
              id="deleteCertificate"
              className="btn btn-outline border-none text-white text-lg bg-red-600"
              onClick={deleteCertificate}>
              O'chirish
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>Yopish</button>
        </form>
      </dialog>
    </>
  );
}
