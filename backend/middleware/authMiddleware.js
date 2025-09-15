import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";

async function protect(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const tenant = await Tenant.findById(user.tenantId);
    
    if (!tenant) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    req.user = user;
    req.tenant = tenant;

    next();
  } catch (error) {
    console.log("Error in authMiddleware:", error.message);

    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
}

export default protect;
