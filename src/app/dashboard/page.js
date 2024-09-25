"use client";
import { useEffect, useState } from "react";
import { FormatDate } from "../../components/FormatDate";

export default function page() {
  const [graduates, setGraduates] = useState(null);
  const [sort, setSort] = useState("all");
  const [filteredGraduates, setFilteredGraduates] = useState(null);
  const [certificates, setCertificates] = useState(null);
  console.log(graduates);

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
    setFilteredGraduates(filtered);
  }

  function sortData(type) {
    console.log(type);

    if (type === "all") {
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
          return a.name.localeCompare(b.name);
        });
        setFilteredGraduates(sorted);
        setSort("name");
      } else {
        setGraduates((old) =>
          old.sort((a, b) => {
            return a.name.localeCompare(b.name);
          })
        );
        setSort("name");
      }
    }
  }

  return (
    <div className="container mt-10">
      <div className="stats stats-mobile w-full shadow shadow-white mb-10">
        <div className="stat place-items-center">
          <div className="stat-title">Bitiruvchilar</div>
          <div className="stat-value">{graduates?.length ?? 0}</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title text-xl font-bold">Sertifikatlar</div>
          <div className="stat-value text-primary">
            {certificates?.length ?? 0}
          </div>
        </div>
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
                  type="radio"
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
                  Sana
                </label>
                <input
                  id="date"
                  name="sort"
                  type="radio"
                  className="appearance-none"
                  onChange={(e) =>
                    e.target.checked ? sortData("date") : sortData("all")
                  }
                />
              </th>
              <th className="text-center">
                <select
                  className="select select-bordered text-xl text-white text-center"
                  name="course"
                  onChange={(e) => filterData(e.target.value)}>
                  <option value="all">Kurs nomi</option>
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
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGraduates &&
              filteredGraduates.map((graduate, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{graduate.name}</td>
                  <td className="text-center">
                    {FormatDate(graduate.graduationDate)}
                  </td>
                  <td className="text-center">{graduate?.course}</td>
                </tr>
              ))}
            {graduates &&
              !filteredGraduates &&
              graduates.map((graduate, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{graduate.name}</td>
                  <td className="text-center">
                    {FormatDate(graduate.graduationDate)}
                  </td>
                  <td className="text-center">{graduate?.course}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
