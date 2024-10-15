"use server";
import fs from "fs";
import path from "path";
import connectMongoDb from "../../../../lib/mongodb";
import Certificate from "../../../../models/Certificate";
export async function POST(req) {
  await connectMongoDb();

  // Получаем данные сертификата из запроса
  const { owner, certificateNumber, date, file, course } = await req.json();

  try {
    // Создание нового сертификата
    const certificate = new Certificate({
      owner,
      certificateNumber,
      date,
      file,
      course,
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
      const certificates = await Certificate.find().sort({ date: -1 });
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

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await connectMongoDb();
  try {
    // Find the certificate by ID
    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Sertifikat topilmadi!",
        }),
        { status: 404 }
      );
    }

    // Define the path to the file you want to delete
    const filePath = path.join(
      process.cwd(),
      "public/uploads",
      certificate.file.slice(9)
    );

    // Delete the file from the file system
    fs.unlink(filePath, (err) => {
      if (err) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Fayl o'chirishda xatolik!",
          }),
          { status: 500 }
        );
      }
    });

    const deletedCertificate = await Certificate.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Sertifikat muvaffaqqiyatli o'chirildi!",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
