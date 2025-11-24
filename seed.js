import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/user.model.js";

const createDefaultUsers = async () => {
    try {
        // 1. Kết nối DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // 2. Hỏi xác nhận trước khi xóa dữ liệu
        console.log("\n⚠️  WARNING: This will delete ALL users from the database!");
        console.log("Press Ctrl+C to cancel or wait 3 seconds to continue...");

        // Đếm ngược 3 giây
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 3. Xóa toàn bộ users trong collection
        const deleteResult = await User.deleteMany({});
        console.log(`\n🗑️  Deleted ${deleteResult.deletedCount} users from database`);

        // 4. Tạo admin với đầy đủ thông tin
        await User.create({
            username: "admin",
            email: "admin@example.com",
            password: "123456",
            role: "admin",
            fullname: "Nguyễn Văn Admin",
            phoneNumber: "0901234567",
            address: "123 Đường Lê Lợi, Quận 1, TP.HCM"
        });
        console.log("\n🎉 Default Admin Created!");
        console.log("👉 Username: admin");
        console.log("🔑 Password: 123456");
        console.log("📧 Email: admin@example.com");
        console.log("👤 Fullname: Nguyễn Văn Admin");
        console.log("📞 Phone: 0901234567");
        console.log("🏠 Address: 123 Đường Lê Lợi, Quận 1, TP.HCM");

        // 5. Tạo user thông thường với đầy đủ thông tin
        await User.create({
            username: "user01",
            email: "user01@example.com",
            password: "123456",
            role: "user",
            fullname: "Trần Thị User",
            phoneNumber: "0917654321",
            address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM"
        });
        console.log("\n🎉 Default User Created!");
        console.log("👉 Username: user01");
        console.log("🔑 Password: 123456");
        console.log("📧 Email: user01@example.com");
        console.log("👤 Fullname: Trần Thị User");
        console.log("📞 Phone: 0917654321");
        console.log("🏠 Address: 456 Đường Nguyễn Huệ, Quận 1, TP.HCM");

        // 6. Tạo thêm một user không có thông tin bổ sung (để test trường hợp null)
        await User.create({
            username: "user02",
            email: "user02@example.com",
            password: "123456",
            role: "user"
            // fullname, phoneNumber, address sẽ là null
        });
        console.log("\n🎉 Additional User Created (with null fields)!");
        console.log("👉 Username: user02");
        console.log("🔑 Password: 123456");
        console.log("📧 Email: user02@example.com");
        console.log("👤 Fullname: null");
        console.log("📞 Phone: null");
        console.log("🏠 Address: null");

        // 7. Hiển thị tất cả users
        console.log("\n📋 All Users in Database:");
        const allUsers = await User.find({}, { password: 0 }); // Ẩn password
        console.log(JSON.stringify(allUsers, null, 2));

        process.exit(0);
    } catch (error) {
        console.error("❌ Error: ", error);
        process.exit(1);
    }
};

createDefaultUsers();