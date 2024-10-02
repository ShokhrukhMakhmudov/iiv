import connectMongoDb from "../../../../lib/mongodb";
import Graduate from "../../../../models/Graduate";

export async function POST(req, res) {
  await connectMongoDb();

  const { name, lastname, surname, passport, jshir, graduationDate, course } =
    await req.json(); // используйте req.json() для получения данных в Next.js API роуте

  try {
    // Создание и сохранение нового выпускника
    const graduate = new Graduate({
      name,
      surname,
      lastname,
      passport,
      jshir,
      graduationDate,
      course,
    });

    const savedGraduate = await graduate.save();
    return new Response(
      JSON.stringify({ success: true, graduate: savedGraduate }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400 }
    );
  }
}

export async function GET() {
  await connectMongoDb();

  try {
    const graduates = await Graduate.find(); // Получаем всех выпускников из базы данных
    return new Response(JSON.stringify(graduates), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
