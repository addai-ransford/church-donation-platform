import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) return res.sendStatus(401);

  try {
    const token = header.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;
    next();
  } catch {
    res.sendStatus(403);
  }
}