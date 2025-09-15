 async function adminOnly(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admin only" });
    }
    next();
  } catch (error) {
    console.log("Error in adminOnly middleware:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}

export default adminOnly;

