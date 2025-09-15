import Note from "../models/Note.js";

async function enforceNoteLimit(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const user = req.user;
    const tenant = req.tenant

    if (tenant.plan === "pro") {
      return next();
    }

    const noteCount = await Note.countDocuments({ tenantId: user.tenantId });

    if (noteCount >= 3) {
      return res
        .status(403)
        .json({ message: "Free plan limit reached. Upgrade to Pro." });
    }

    next();
  } catch (error) {
    console.log("Error in enforceNoteLimit middleware:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}

export default enforceNoteLimit;
