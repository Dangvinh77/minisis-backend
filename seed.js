import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.model.js";

const createAdmin = async () => {
    try {
        // 1. Kết nối DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB Connected");

        // 2. Kiểm tra đã tồn tại Admin chưa
        const exists = await User.findOne({ username: "admin" });
        if (exists) {
            console.log("⚠️ Admin already exists!");
            process.exit(0);
        }

        // 4. Tạo admin
        await User.create({
            username: "admin",
            password:"123456",
            role: "admin",
        });

        console.log("🎉 Default Admin Created!");
        console.log("👉 Username: admin");
        console.log("🔑 Password: 123456");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error: ", error);
        process.exit(1);
    }
};

createAdmin();
