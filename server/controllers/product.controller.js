const prisma = require('../utils/db');

const getProducts = async (req, res, next) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    const { name, description, price, stock, imageUrl } = req.body;
    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                imageUrl,
            },
        });
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    const { name, description, price, stock, imageUrl } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id: parseInt(req.params.id) },
            data: {
                name,
                description,
                price,
                stock,
                imageUrl,
            },
        });
        res.json(product);
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        await prisma.product.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: 'Product removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
