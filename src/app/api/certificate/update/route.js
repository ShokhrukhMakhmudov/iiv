"use server";

import connectMongoDb from "../../../../../lib/mongodb";
import Certificate from "../../../../../models/Certificate";

export async function POST(req) {
  await connectMongoDb();

  // Получаем данные сертификата из запроса
  const { owner, certificateNumber, date, file } = await req.json();

  try {
    // Находим сертификат по ключу file
    const existingCertificate = await Certificate.findOne({ _id: file });

    if (!existingCertificate) {
      // Если сертификат с таким file не найден, возвращаем ошибку
      return new Response(
        JSON.stringify({ success: false, message: "Сертификат не найден" }),
        { status: 404 }
      );
    }

    // Обновляем найденный сертификат новыми данными
    existingCertificate.owner = owner;
    existingCertificate.certificateNumber = certificateNumber;
    existingCertificate.date = date;

    // Сохраняем обновленный сертификат
    const updatedCertificate = await existingCertificate.save();

    // Возвращаем успешный ответ с обновлёнными данными
    return new Response(
      JSON.stringify({ success: true, certificate: updatedCertificate }),
      { status: 200 }
    );
  } catch (error) {
    // В случае ошибки отправляем сообщение об ошибке
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400 }
    );
  }
}
