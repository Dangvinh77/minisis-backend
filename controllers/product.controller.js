import Product from "../models/product.model.js";

// @desc    Lấy tất cả sản phẩm
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
    try {
        const {
            category,
            saleStatus,
            gender,
            minPrice,
            maxPrice,
            favourite,
            page = 1,
            limit = 10,
            sort = '-importDate'
        } = req.query;

        // Build query object
        let query = {};

        // Filter by category
        if (category && ['eyeglasses', 'sunglasses'].includes(category)) {
            query.category = category;
        }

        // Filter by sale status
        if (saleStatus && ['yes', 'no'].includes(saleStatus)) {
            query.saleStatus = saleStatus;
        }

        // Filter by gender
        if (gender && ['Male', 'Female', 'Unisex', 'NA'].includes(gender)) {
            query.gender = gender;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }

        // Filter by favourite
        if (favourite !== undefined) {
            query.favourite = favourite === 'true';
        }

        // Execute query with pagination
        const products = await Product.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách sản phẩm',
            error: error.message
        });
    }
};

// @desc    Lấy sản phẩm theo ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thông tin sản phẩm',
            error: error.message
        });
    }
};

// @desc    Lấy sản phẩm theo category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10, sort = '-importDate' } = req.query;

        if (!['eyeglasses', 'sunglasses'].includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Category không hợp lệ. Chỉ chấp nhận eyeglasses hoặc sunglasses'
            });
        }

        const products = await Product.find({ category })
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Product.countDocuments({ category });

        res.status(200).json({
            success: true,
            category,
            count: products.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy sản phẩm theo category',
            error: error.message
        });
    }
};

// @desc    Tìm kiếm sản phẩm
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
    try {
        const { q, category, page = 1, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập từ khóa tìm kiếm'
            });
        }

        let query = {
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { owner: { $regex: q, $options: 'i' } },
                { modelCode: { $regex: q, $options: 'i' } },
                { frontColor: { $regex: q, $options: 'i' } },
                { lensColor: { $regex: q, $options: 'i' } }
            ]
        };

        // Thêm filter category nếu có
        if (category && ['eyeglasses', 'sunglasses'].includes(category)) {
            query.category = category;
        }

        const products = await Product.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            searchTerm: q,
            count: products.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tìm kiếm sản phẩm',
            error: error.message
        });
    }
};

// @desc    Lấy sản phẩm đang sale
// @route   GET /api/products/sale/on-sale
// @access  Public
export const getProductsOnSale = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const products = await Product.find({ saleStatus: 'yes' })
            .sort('-importDate')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Product.countDocuments({ saleStatus: 'yes' });

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy sản phẩm đang sale',
            error: error.message
        });
    }
};

// @desc    Lấy sản phẩm mới nhất
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = async (req, res) => {
    try {
        const { limit = 8, category } = req.query;

        let query = {};
        if (category && ['eyeglasses', 'sunglasses'].includes(category)) {
            query.category = category;
        }

        const products = await Product.find(query)
            .sort('-importDate')
            .limit(parseInt(limit))
            .lean();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy sản phẩm mới nhất',
            error: error.message
        });
    }
};

// @desc    Cập nhật trạng thái yêu thích
// @route   PATCH /api/products/:id/favourite
// @access  Public
export const toggleFavourite = async (req, res) => {
    try {
        const { favourite } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { favourite },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.status(200).json({
            success: true,
            message: `Đã ${favourite ? 'thêm vào' : 'xóa khỏi'} danh sách yêu thích`,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật trạng thái yêu thích',
            error: error.message
        });
    }
};

// @desc    Lấy số liệu thống kê sản phẩm
// @route   GET /api/products/stats/summary
// @access  Public
export const getProductStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const eyeglassesCount = await Product.countDocuments({ category: 'eyeglasses' });
        const sunglassesCount = await Product.countDocuments({ category: 'sunglasses' });
        const onSaleCount = await Product.countDocuments({ saleStatus: 'yes' });

        // Lấy sản phẩm mới nhất trong 7 ngày
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newProductsCount = await Product.countDocuments({
            importDate: { $gte: sevenDaysAgo }
        });

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                byCategory: {
                    eyeglasses: eyeglassesCount,
                    sunglasses: sunglassesCount
                },
                onSale: onSaleCount,
                newLast7Days: newProductsCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thống kê',
            error: error.message
        });
    }
};