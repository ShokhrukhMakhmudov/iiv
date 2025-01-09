import { promises as fs } from "fs";
import path from "path";
import { config } from "../middleware";
export async function POST(req) {
  try {
    // Получаем данные файла из запроса
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "Файл не предоставлен" }), {
        status: 400,
      });
    }

    // Получаем бинарные данные файла
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Папка для сохранения файла в директорию public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true }); // Создаем папку, если её нет

    // Генерируем путь для файла
    const filePath = path.join(uploadDir, file.name.replace(/\s/g, ""));

    // Сохраняем файл
    await fs.writeFile(filePath, fileBuffer);

    // Возвращаем путь относительно директории public (для URL)
    const publicFilePath = path.join("/uploads", file.name.replace(/\s/g, ""));

    return new Response(JSON.stringify({ path: publicFilePath }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Ошибка при загрузке файла" }),
      { status: 500 }
    );
  }
}
export { config };
