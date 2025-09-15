import "dotenv/config";
import connectDB from "../config/db.js";
import Tenant from "../models/Tenant.js";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";

async function seed() {
  try {
    await connectDB();

    await Tenant.deleteMany({});
    await User.deleteMany({});

    const acme = await Tenant.create({
      name: "Acme",
      slug: "acme",
      plan: "free",
    });

    const globex = await Tenant.create({
      name: "Globex",
      slug: "globex",
      plan: "free",
    });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash("password", salt);

    await User.create({
      email: "admin@acme.test",
      password: hashedPassword,
      role: "admin",
      tenantId: acme._id,
    });

    await User.create({
      email: "user@acme.test",
      password: hashedPassword,
      role: "member",
      tenantId: acme._id,
    });

    await User.create({
      email: "admin@globex.test",
      password: hashedPassword,
      role: "admin",
      tenantId: globex._id,
    });

    await User.create({
      email: "user@globex.test",
      password: hashedPassword,
      role: "member",
      tenantId: globex._id,
    });

    console.log("Seeded tenants and users successfully");
    process.exit(0);
  } catch (error) {
    console.log("Error in seed:", error.message);
    process.exit(1);
  }
}

seed();
