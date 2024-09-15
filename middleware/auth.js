import jwt from "jsonwebtoken";

export function verifyToken(req) {
  const authorization = req.headers.get("authorization");
  if (!authorization) {
    return { error: "Токен отсутствует" };
  }

  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.userId };
  } catch (error) {
    return { error: "Неверный токен" };
  }
}
