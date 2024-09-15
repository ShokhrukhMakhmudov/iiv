import { verifyToken } from "../../../../middleware/auth";

export async function GET(req) {
  const { userId, error } = verifyToken(req);
  if (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  // Теперь вы можете использовать userId для получения данных пользователя
  return new Response(
    JSON.stringify({ message: `Привет, пользователь ${userId}!` }),
    { status: 200 }
  );
}
