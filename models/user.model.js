import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    fullname: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    address: { type: String, trim: true }
});

// Hash password before save
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.model("User", UserSchema);