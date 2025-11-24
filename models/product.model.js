import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    owner: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    image1: { type: String, required: true },
    image2: { type: String, required: true },
    variantImage2: { type: String },
    variantImage3: { type: String },
    variantImage4: { type: String },
    price: { type: String, required: true, trim: true },
    favourite: { type: Boolean, default: false },
    gender: { type: String, default: "NA", trim: true },
    start: { type: String, trim: true }, // Rating
    sold: { type: String, trim: true }, // Sales count
    modelCode: { type: String, trim: true },
    frontColor: { type: String, trim: true },
    lensColor: { type: String, trim: true },
    lensMaterial: { type: String, trim: true },
    frameMaterial: { type: String, trim: true },
    measurements: { type: String, trim: true },
    fit: { type: String, trim: true },
    bridgeChoiceNosepad: { type: String, trim: true },

    // Các trường mới thêm

    category: {
        type: String,
        required: true,
        trim: true,
        enum: ["eyeglasses", "sunglasses"],
        default: "eyeglasses"
    },
    importDate: {
        type: Date,
        default: Date.now
    },
    saleStatus: {
        type: String,
        enum: ["yes","no"],
        default: "available"
    }
});

// Tạo index để tìm kiếm nhanh hơn
ProductSchema.index({ owner: 1, name: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ favourite: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ saleStatus: 1 });
ProductSchema.index({ importDate: -1 });



export default mongoose.model("Product", ProductSchema);