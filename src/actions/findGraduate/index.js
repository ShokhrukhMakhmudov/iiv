"use server";
import connectMongoDb from "../../../lib/mongodb";
import Graduate from "../../../models/Graduate";

// Функция для поиска выпускника
async function findGraduate(passport, jshir) {
  await connectMongoDb();
  try {
    // Ищем выпускника по серии и номеру паспорта, а также по JSHIR
    const graduate = await Graduate.findOne({
      passport,
      jshir,
    });

    if (graduate) {
      return JSON.stringify(graduate); // Возвращаем найденного выпускника
    } else {
      return null; // Выпускник не найден
    }
  } catch (error) {
    console.log("Ошибка при поиске выпускника:", error);
    throw error;
  }
}

export default findGraduate;
