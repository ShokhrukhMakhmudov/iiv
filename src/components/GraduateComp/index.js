"use client";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/context";
import { FormatDate } from "../FormatDate";

export default function index() {
  const { data: graduate } = useContext(Context);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getCertificates() {
      const response = await fetch("/api/certificate?owner=" + graduate._id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      setData(data);
    }

    getCertificates();
  }, []);

  return (
    <section className="py-10 text-white" id="graduate">
      <div className="container">
        {graduate ? (
          <div className="flex flex-col justify-center gap-10 border">
            <div className="flex items-center justify-center gap-10 p-5">
              <img
                className="hidden md:block"
                src={graduate?.photo ?? "/user.png"}
                alt="user image"
                width={250}
              />
              <div className="flex flex-col font-mont">
                <h3 className="text-2xl font-bold mb-5">
                  Bitiruvchi ma'lumotlari
                </h3>
                <h3 className="text-2xl mb-5">
                  Familiya: <b>{graduate.lastname}</b>
                </h3>
                <h3 className="text-2xl mb-5">
                  Ism: <b>{graduate.name}</b>
                </h3>
                <h3 className="text-2xl mb-5">
                  Otasining ismi: <b>{graduate.surname}</b>
                </h3>

                <h3 className="text-2xl">
                  Sertifikatlar soni: <b>{data?.length ?? 0}</b>
                </h3>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-center mb-10">
                Sertifikatlar
              </h2>
              {data && (
                <table className="table table-lg">
                  {/* head */}
                  <thead>
                    <tr className="text-xl text-white border-b-white">
                      <th>№</th>
                      <th>Nomi</th>
                      <th className="text-center">Sana</th>
                      <th className="text-center">Fayl</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    {data.map(({ certificateNumber, date, file }, index) => (
                      <tr key={index}>
                        <th>{index + 1}</th>
                        <td className="text-xl">{certificateNumber}</td>
                        <td className="text-xl text-center">
                          {FormatDate(date)}
                        </td>
                        <td>
                          <a
                            className="flex flex-col items-center"
                            href={file.replace(/\\/g, "/")}
                            download>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 24 24"
                              height="50px"
                              width="50px"
                              xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z"></path>
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z"></path>
                            </svg>
                            <span>Yuklab olish</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-40">
            <span
              className="loading loading-ring loading-lg"
              style={{ zoom: 3.5 }}></span>
          </div>
        )}
      </div>
    </section>
  );
}
