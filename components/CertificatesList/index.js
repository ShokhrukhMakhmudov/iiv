import { useEffect, useMemo, useRef, useState } from "react";
import Loader from "../Loader";
import { FormatDate } from "../FormatDate";

export default function CertificatesList({ graduates }) {
  const searchCertificates = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function getCertificates() {
      const response = await fetch("/api/certificate");
      const data = await response.json();
      setCertificates(data);
    }
    getCertificates();
  }, [refreshData]);

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
  async function handleSearchCertificates(e) {
    e.preventDefault();
    const searchText = searchCertificates.current.value.toLowerCase().trim();

    if (searchText === "") {
      setRefreshData((prev) => !prev);
      return;
    }

    setLoading(true);

    const req = await fetch(`/api/certificate/search?search=${searchText}`);
    const res = await req.json();

    if (req.status === 200) {
      setCertificates(res);
    }
    setLoading(false);
  }
  const certificatePages = useMemo(() => {
    const pages =
      certificates.length > 0 ? Math.ceil(certificates.length / 50) : 1;

    setPage(1);
    const result = [];
    for (let i = 1; i <= pages; i++) {
      result.push(i);
    }
    return result;
  }, [certificates]);

  async function deleteCertificate(e) {
    const id = e.target.getAttribute("data-id");
    setLoading(true);
    const response = await fetch("/api/certificate?id=" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.success) {
      alert("Sertifikat muvaffaqiyatli o'chirildi");
    } else {
      alert(data.message);
    }
    setRefreshData((prev) => !prev);
    setLoading(false);
  }

  function selectCertificate(checked, id) {
    if (checked) {
      setSelectedCertificates((prev) => ({ ...prev, [id]: true }));
    } else {
      setSelectedCertificates((prev) => {
        delete prev[`${id}`];
        return { ...prev };
      });
    }
  }

  function toogleSelectAll(e) {
    if (e.target.checked) {
      const selectAll = certificates
        .slice((page - 1) * 50, page * 50)
        .reduce((obj, { _id }) => {
          obj[`${_id}`] = true;
          return obj;
        }, {});
      setSelectedCertificates(selectAll);
      return;
    }

    setSelectedCertificates({});
  }

  function showDeleteModal() {
    document.getElementById("selectedCerCount").innerText =
      Object.keys(selectedCertificates).length;
    document.getElementById("deleteModalCertificate").showModal();
  }

  async function deleteSelectedCertificates() {
    setLoading(true);
    const response = await fetch("/api/certificate/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: Object.keys(selectedCertificates) }),
    });
    const data = await response.json();

    if (data.success) {
      alert("Sertifikat muvaffaqiyatli o'chirildi");
      window.location.reload();
    } else {
      alert(data.message);
    }

    setLoading(false);
  }
  if (loading) return <Loader />;
  return (
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
        <table className="table w-full text-xl mb-5">
          {/* head */}
          <thead>
            <tr className="text-lg">
              <th>
                <button
                  className="btn btn-outline text-error"
                  disabled={Object.keys(selectedCertificates).length === 0}
                  onClick={showDeleteModal}>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    height="20px"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path>
                  </svg>
                </button>
              </th>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    disabled={certificates.length === 0}
                    onChange={toogleSelectAll}
                  />
                </label>
              </th>
              <th>Raqam / Fayl nomi</th>
              <th className="text-center">Kurs nomi</th>
              <th className="text-center">Sana</th>
            </tr>
          </thead>
          <tbody>
            {certificates.length !== 0 ? (
              certificates
                .slice((page - 1) * 50, page * 50)
                .map((certificate, index) => (
                  <tr key={certificate?._id}>
                    <th>{index + 1}</th>
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          onChange={(e) =>
                            selectCertificate(e.target.checked, certificate._id)
                          }
                          checked={
                            selectedCertificates?.[certificate._id] || false
                          }
                        />
                      </label>
                    </th>
                    <td
                      className="cursor-pointer"
                      onClick={() => showCertificate(certificate)}>
                      {certificate.certificateNumber ??
                        certificate.file.slice(9)}
                    </td>
                    <td className="text-center">{certificate.course}</td>
                    <td className="text-center">
                      {certificate?.date
                        ? FormatDate(certificate?.date)
                        : "Faol emas"}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-2xl">
                  Sertifikatlar mavjud emas!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {certificates.length > 50 && (
          <div className="join w-full justify-center mb-10">
            <button
              className="join-item btn"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}>
              «
            </button>
            {certificatePages.slice(0, 3).map((num) => (
              <button
                key={num}
                className={`join-item btn ${
                  page === num && "btn-active btn-primary"
                }`}
                onClick={() => setPage(num)}>
                {num}
              </button>
            ))}
            <button className="join-item btn btn-active ">...</button>
            {certificatePages.slice(-3).map((num) => (
              <button
                key={num}
                className={`join-item btn ${
                  page === num && "btn-active btn-primary"
                }`}
                onClick={() => setPage(num)}>
                {num}
              </button>
            ))}
            <button
              className="join-item btn"
              disabled={page === certificatePages.length}
              onClick={() => setPage((prev) => prev + 1)}>
              »
            </button>
            {/* <button className="join-item btn">1</button>
              <button className="join-item btn">2</button>
              <button className="join-item btn btn-disabled">...</button>
              <button className="join-item btn">99</button>
              <button className="join-item btn">100</button> */}
          </div>
        )}
      </div>
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
      {/* Modal Delete Certificates */}
      <dialog id="deleteModalCertificate" className="modal">
        <div className="modal-box w-fit sm:text-2xl">
          <div className="flex justify-between mb-5"></div>
          <p className="mb-5">
            Tanlangan sertifikatlar soni:{" "}
            <span id="selectedCerCount" className="btn btn-accent text-2xl">
              0
            </span>
          </p>

          <p>Sertifikatlarni o'chirishga ishonchingiz komilmi?</p>
          <div className="flex justify-end gap-5 mt-5">
            <button
              id="deleteCertificate"
              className="btn  text-white text-lg bg-primary"
              onClick={deleteSelectedCertificates}>
              Ha
            </button>

            <form method="dialog">
              <button className="btn btn-outline text-white text-lg">
                Yo'q
              </button>
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>Yopish</button>
        </form>
      </dialog>
    </>
  );
}
