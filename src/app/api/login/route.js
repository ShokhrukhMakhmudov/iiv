import connectMongoDb from "../../../../lib/mongodb";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectMongoDb();

  const { email, password } = await req.json();

  // Поиск пользователя по email
  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "Неверные учетные данные" }), {
      status: 400,
    });
  }

  // Проверка пароля
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return new Response(JSON.stringify({ error: "Неверные учетные данные" }), {
      status: 400,
    });
  }

  // Генерация JWT-токена
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return new Response(JSON.stringify({ token }), { status: 200 });
}
