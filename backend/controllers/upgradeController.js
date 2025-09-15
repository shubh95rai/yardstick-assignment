import Tenant from "../models/Tenant.js";

export async function upgradePlan(req, res) {
  try {
    const { slug } = req.params;

    if (req.tenant.slug !== slug) {
      return res.status(403).json({ message: "Forbidden - Not authorized" });
    }

    const tenant = await Tenant.findOneAndUpdate(
      { slug },
      { plan: "pro" },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.status(200).json({ message: "Plan upgraded successfully" });
  } catch (error) {
    console.log("Error in upgradePlan controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}
