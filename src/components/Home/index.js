import React, { useContext } from "react";
import Header from "../Header";
import BackgroundVideo from "../BackgroundVideo";
import GraduateComp from "../GraduateComp";
import { Context } from "../../context/context";

export default function Home() {
  const { data, setData } = useContext(Context);
  return (
    <>
      <Header />
      <BackgroundVideo />
      {data && <GraduateComp />}
    </>
  );
}
