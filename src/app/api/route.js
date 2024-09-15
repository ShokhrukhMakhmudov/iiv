import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    // Подключаемся к MongoDB
    const client = await clientPromise;
    const db = client.db("cluster0"); // Укажите название вашей базы данных

    // Пример выборки данных из коллекции
    const data = await db.collection("your-collection").find({}).toArray();

    // Отправляем результат в формате JSON
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при подключении к базе данных" });
  }
}
