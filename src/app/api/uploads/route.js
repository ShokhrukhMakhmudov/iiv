import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import connectMongoDb from "../../../../lib/mongodb";
import Certificate from "../../../../models/Certificate";
import { config200 } from "../middleware";

// Максимальный допустимый размер файла (например, 10 MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req) {
  await connectMongoDb();

  const formData = await req.formData();
  const files = formData.getAll("files");

  if (!files || files.length === 0) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Файлы не загружены" }),
      { status: 400 }
    );
  }

  const uploadedFiles = [];

  try {
    for (const file of files) {
      const fileSize = file.size;

      if (fileSize > MAX_FILE_SIZE) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: `Размер файла ${file.name} превышает 10MB`,
          }),
          { status: 413 }
        );
      }

      // Создаем уникальное имя файла и путь для сохранения
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);

      // Сохраняем файл на диск
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      // Сохраняем информацию о сертификате в базе данных
      const certificate = new Certificate({
        owner: "unknown",
        certificateNumber: fileName,
        expirationDate: new Date(),
        file: `/uploads/${fileName}`, // Относительный путь к файлу
      });

      await certificate.save();
      uploadedFiles.push(certificate);
    }

    return new NextResponse(
      JSON.stringify({ success: true, certificates: uploadedFiles }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
export { config200 };
