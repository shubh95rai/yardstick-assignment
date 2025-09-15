import mongoose from "mongoose";

const InviteTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expireAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 1000 * 60 * 60 * 24, // 24h in milliseconds
    },
  },
  { timestamps: true }
);

const InviteToken = mongoose.model("InviteToken", InviteTokenSchema);

export default InviteToken;
