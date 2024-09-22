"use client";
import { useEffect, useState } from "react";

export default function page() {
  const [graduates, setGraduates] = useState([]);
  const [certificates, setCertificates] = useState([]);

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
  return (
    <div className="container mt-10">
      <div className="stats stats-mobile w-full shadow shadow-white mb-10">
        <div className="stat place-items-center">
          <div className="stat-title">Bitiruvchilar</div>
          <div className="stat-value">{graduates.length}</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title text-xl font-bold">Sertifikatlar</div>
          <div className="stat-value text-primary">{certificates.length}</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full text-xl">
          {/* head */}
          <thead>
            <tr className="text-lg">
              <th></th>
              <th>Ismi</th>
              <th>Sana</th>
              <th>Sertifikatlar soni</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
