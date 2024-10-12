"use client";
import { useState } from "react";

export default function ImageInput({ setFile, photo = null}) {
  const [selectedFile, setSelectedFile] = useState(null);

  // Обработчик для изменения файла
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  if(photo) {
    return (
      <>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="fileInput"
          className="cursor-pointer border border-dashed border-gray-400 w-full h-full flex items-center justify-center rounded-xl"
          style={{
            backgroundImage: selectedFile ? `url(${selectedFile})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
        </label>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center border p-5 rounded-xl h-full">
       <span className="mb-5">Rasm yuklash</span>

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

     
      <label
        htmlFor="fileInput"
        className="cursor-pointer border border-dashed border-gray-400 w-40 h-40 flex items-center justify-center rounded-xl"
        style={{
          backgroundImage: selectedFile ? `url(${selectedFile})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        {!selectedFile && <span className="text-4xl text-gray-400">+</span>}
      </label>
      

      {selectedFile && <p className="mt-3">Rasm yuklandi</p>}
    </div>
  );
}
