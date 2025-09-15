import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
};

export function setTokenCookie(res, token) {
  res.cookie("token", token, cookieOptions);
}

export function generateToken(userId, res) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  setTokenCookie(res, token);

  return token;
}

export function clearTokenCookie(res) {
  const clearOptions = { ...cookieOptions };
  delete clearOptions.maxAge; // Not needed when clearing
  res.clearCookie("token", clearOptions);
}
