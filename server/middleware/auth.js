import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  if (!authHeader) {
    return res.status(401).json({ error: "no token" });
  }

  try {
    const user = jwt.verify(token, process.env.SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
};

export default auth;