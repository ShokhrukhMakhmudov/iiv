"use client";

import { useRef, useState } from "react";
import Modal from "../Modal";
import Auth from "../Auth";

const BackgroundVideo = () => {
  const videoRef = useRef(null);

  const handleVideoEnd = () => {
    const video = videoRef.current;
    if (video && video.currentTime > 3.9) {
      video.pause();
    }
  };

  // Modal
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        id="video"
        ref={videoRef}
        className="absolute top-0 left-0 h-full w-full object-cover blur-[3px]"
        autoPlay
        muted
        onTimeUpdate={handleVideoEnd}>
        <source src="/video.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="max-w-[700px] text-white text-center mt-[-100px]">
          <h2 className="text-3xl font-bold mb-5 font-mont uppercase">
            Ichki Ishlar Vazirligi <br /> Malaka Oshirish Instituti
          </h2>
          <p className="text-2xl">
            Bizning saytimiz Ichki Ishlar Vazirligi Malaka Oshirish
            Institutining rasmiy sertifikat olish platformasidir. Bu yerda siz
            malaka oshirish kurslarini muvaffaqiyatli tamomlaganingizdan so‘ng,
            o‘z sertifikatingizni onlayn tarzda olishingiz mumkin.
          </p>
          <button
            className="inline-block mt-5 border py-2 px-4 rounded-xl text-xl hover:bg-[#ffffff8a]"
            onClick={openModal}>
            Sertifikat olish
          </button>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0" />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Auth closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default BackgroundVideo;
