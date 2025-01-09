"use client";
import Home from "../components/Home";
import { ContextProvider } from "../context/context";

export default function page() {
  return (
    <>
      <ContextProvider>
        <Home />
      </ContextProvider>
    </>
  );
}
