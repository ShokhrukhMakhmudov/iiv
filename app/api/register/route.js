import connectMongoDb from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req) {
  await connectMongoDb();

  const { email, password } = await req.json();

  // Проверка, что пользователь не существует
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(
      JSON.stringify({ error: "Пользователь уже существует" }),
      { status: 400 }
    );
  }

  try {
    const newUser = new User({ email, password });
    await newUser.save();

    return new Response(
      JSON.stringify({ message: "Пользователь успешно создан" }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Ошибка создания пользователя" }),
      { status: 500 }
    );
  }
}
