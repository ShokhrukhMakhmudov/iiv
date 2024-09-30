"use server";

import connectMongoDb from "../../../../lib/mongodb";
import Certificate from "../../../../models/Certificate";
export async function POST(req) {
  await connectMongoDb();

  // Получаем данные сертификата из запроса
  const { owner, certificateNumber, expirationDate, file } = await req.json();

  try {
    // Создание нового сертификата
    const certificate = new Certificate({
      owner,
      certificateNumber,
      expirationDate,
      file,
    });

    // Сохраняем сертификат в базу данных
    const savedCertificate = await certificate.save();

    // Возвращаем успешный ответ с данными о сертификате
    return new Response(
      JSON.stringify({ success: true, certificate: savedCertificate }),
      { status: 201 }
    );
  } catch (error) {
    // В случае ошибки отправляем сообщение об ошибке
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");

  await connectMongoDb();

  try {
    if (!owner) {
      const certificates = await Certificate.find();
      return new Response(JSON.stringify(certificates), {
        status: 200,
      });
    }
    const certificates = await Certificate.find({ owner });
    return new Response(JSON.stringify(certificates), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
