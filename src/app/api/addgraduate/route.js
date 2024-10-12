import connectMongoDb from "../../../../lib/mongodb";
import Graduate from "../../../../models/Graduate";

export async function POST(req, res) {
  await connectMongoDb();

  const { name, lastname, surname, passport, jshir, photo } = await req.json(); // используйте req.json() для получения данных в Next.js API роуте

  try {
    // Создание и сохранение нового выпускника
    const graduate = new Graduate({
      name,
      surname,
      lastname,
      passport: passport.toUpperCase().trim(),
      jshir: jshir.toUpperCase().trim(),
      photo,
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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");


  await connectMongoDb();

  try {
     if (!id) {
       const graduates = await Graduate.find(); // Получаем всех выпускников из базы данных
       return new Response(JSON.stringify(graduates), {
         status: 200,
       });
     }
    const graduates = await Graduate.find({ _id: id });
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
