"use server";
import connectMongoDb from "../../../lib/mongodb";
import Certificate from "../../../models/Certificate";
import Graduate from "../../../models/Graduate";

export const updateGraduateCertificateCount = async (id) => {
  await connectMongoDb();

  try {
    const certificateCount = await Certificate.find({ owner: id });
    console.log("================", certificateCount.length);

    const updatedGraduate = await Graduate.findByIdAndUpdate(
      id,
      { certificateCount: certificateCount.length },
      { new: true }
    );

    if (!updatedGraduate) {
      throw new Error("Выпускник не найден");
    }

    return updatedGraduate;
  } catch (error) {
    console.error("Ошибка при обновлении количества сертификатов:", error);
    throw error;
  }
};
