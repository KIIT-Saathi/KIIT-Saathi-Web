import jwt from "jsonwebtoken";

export async function authenticateToken(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Unauthorized: Missing Authorization header");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error("Unauthorized: Missing token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user_id; // MUST match your backend JWT payload
  } catch (err) {
    console.error("JWT verification failed:", err);
    throw new Error("Unauthorized: Invalid token");
  }
}
