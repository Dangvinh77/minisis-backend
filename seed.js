import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import fs from "fs";
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

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

// Hàm tạo random saleStatus
const getRandomSaleStatus = () => {
    const statuses = ["yes", "no"];
    return statuses[Math.floor(Math.random() * statuses.length)];
};

// Hàm tạo random importDate trong vòng 1 năm trở lại
const getRandomImportDate = () => {
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1); // 1 năm trước
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate;
};

// Hàm seed dữ liệu
const seedProducts = async () => {
    try {
        await connectDB();

        // Xóa dữ liệu cũ (tuỳ chọn)
        await Product.deleteMany({});
        console.log("Old products data cleared");

        // Đọc dữ liệu từ file JSON
        const eyeglassesData = JSON.parse(fs.readFileSync("./data/Eyeglasses.json", "utf8"));
        const sunglassesData = JSON.parse(fs.readFileSync("./data/Sunglasses.json", "utf8"));

        // Chuẩn bị dữ liệu eyeglasses
        const eyeglassesWithCategory = eyeglassesData.map(product => ({
            ...product,
            category: "eyeglasses",
            saleStatus: getRandomSaleStatus(),
            importDate: getRandomImportDate()
        }));

        // Chuẩn bị dữ liệu sunglasses
        const sunglassesWithCategory = sunglassesData.map(product => ({
            ...product,
            category: "sunglasses",
            saleStatus: getRandomSaleStatus(),
            importDate: getRandomImportDate()
        }));

        // Kết hợp cả 2 mảng
        const allProducts = [...eyeglassesWithCategory, ...sunglassesWithCategory];

        // Insert vào database
        const result = await Product.insertMany(allProducts);
        console.log(`Successfully seeded ${result.length} products`);

        // Thống kê
        const eyeglassesCount = result.filter(p => p.category === "eyeglasses").length;
        const sunglassesCount = result.filter(p => p.category === "sunglasses").length;

        console.log(`Eyeglasses: ${eyeglassesCount}`);
        console.log(`Sunglasses: ${sunglassesCount}`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding products:", error);
        process.exit(1);
    }
};

// Chạy seed
seedProducts();
createDefaultUsers();