"use server";
import fs from "fs";
import path from "path";
import connectMongoDb from "../../../../../lib/mongodb";
import Certificate from "../../../../../models/Certificate";

export async function POST(req) {
  const body = await req.json(); // Парсим тело запроса
  const ids = body.ids; // Ожидаем массив ID в поле `ids`

  if (!Array.isArray(ids) || ids.length === 0) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Massiv ID-lar bo'sh yoki noto'g'ri formatda yuborilgan!",
      }),
      { status: 400 }
    );
  }

  await connectMongoDb();

  try {
    // Найти все сертификаты по массиву ID
    const certificates = await Certificate.find({ _id: { $in: ids } });

    if (certificates.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Sertifikatlar topilmadi!",
        }),
        { status: 404 }
      );
    }

    // Удалить все связанные файлы
    const deleteFilePromises = certificates.map((certificate) => {
      const filePath = path.join(
        process.cwd(),
        "public/uploads",
        certificate.file.slice(9)
      );

      return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
          resolve();
        });
      });
    });

    await Promise.all(deleteFilePromises); // Ждем завершения всех удалений файлов

    // Удалить документы из базы данных
    await Certificate.deleteMany({ _id: { $in: ids } });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Sertifikatlar muvaffaqqiyatli o'chirildi!",
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
