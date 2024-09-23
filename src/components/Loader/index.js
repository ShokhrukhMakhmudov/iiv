import React from "react";

export default function Loader() {
  return (
    <dialog id="loader" className="modal backdrop-blur-lg" open>
      <div className="flex justify-center">
        <span
          className="loading loading-spinner loading-lg bg-gray-700"
          style={{ zoom: 2 }}></span>
      </div>
    </dialog>
  );
}
