import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import { clearTokenCookie, generateToken } from "../utils/token.js";
import InviteToken from "../models/InviteToken.js";
import crypto from "crypto";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tenant = await Tenant.findById(user.tenantId);

    if (!tenant) {
      return res
        .status(500)
        .json({ message: "Server error - tenant not found" });
    }

    generateToken(user._id, res);

    res.json({ user, tenant });
  } catch (error) {
    console.log("Error in login controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}

export async function logout(req, res) {
  try {
    clearTokenCookie(res);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}

export async function checkAuth(req, res) {
  try {
    const user = req.user;
    const tenant = req.tenant;

    res.status(200).json({ user, tenant });
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}

export async function inviteUser(req, res) {
  try {
    const { email, role, tenantId } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const inviteTokenExists = await InviteToken.findOne({
      email,
      tenantId,
    });

    if (inviteTokenExists) {
      await InviteToken.deleteOne({ email, tenantId });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const inviteToken = await InviteToken.create({
      email,
      role,
      token,
      tenantId,
    });

    const inviteUrl = `${process.env.CLIENT_URL}/invite/${inviteToken.token}`;

    res.status(201).json({ inviteUrl });
  } catch (error) {
    console.log("Error in inviteUser controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}

export async function fetchInviteDetails(req, res) {
  try {
    const token = req.params.token;

    const inviteToken = await InviteToken.findOne({ token });

    if (!inviteToken) {
      return res
        .status(404)
        .json({ message: "Invite token not found or expired" });
    }

    res.status(200).json({ inviteDetails: inviteToken });
  } catch (error) {
    console.log("Error in fetchInviteDetails controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}

export async function acceptInvite(req, res) {
  try {
    const { token, name, password } = req.body;

    const inviteToken = await InviteToken.findOne({ token });

    if (!inviteToken) {
      return res
        .status(404)
        .json({ message: "Invite token not found or expired" });
    }

    const user = await User.findOne({ email: inviteToken.email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    await User.create({
      name,
      email: inviteToken.email,
      password: hashedPassword,
      role: inviteToken.role,
      tenantId: inviteToken.tenantId,
    });

    await InviteToken.deleteOne({ _id: inviteToken._id });

    res.status(200).json({ message: "Account created. You can now log in" });
  } catch (error) {
    console.log("Error in acceptInvite controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}
