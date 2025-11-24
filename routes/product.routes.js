import express from 'express';
import {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getProductsOnSale,
    getNewArrivals,
    toggleFavourite,
    getProductStats
} from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/stats/summary', getProductStats);
router.get('/category/:category', getProductsByCategory);
router.get('/search', searchProducts);
router.get('/sale/on-sale', getProductsOnSale);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id', getProductById);
router.patch('/:id/favourite', toggleFavourite);

export default router;