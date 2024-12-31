"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.getProduct = exports.createProduct = void 0;
const typeorm_1 = require("typeorm");
const Image_1 = require("../entity/Image");
const Product_1 = require("../entity/Product");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sku, name, price } = req.body;
        const productRepo = (0, typeorm_1.getRepository)(Product_1.Product);
        const imageRepo = (0, typeorm_1.getRepository)(Image_1.Image);
        const product = productRepo.create({
            sku,
            name,
            price: parseFloat(price),
        });
        if (req.files && Array.isArray(req.files)) {
            const imageBaseUrl = "http://localhost:3000";
            const images = req.files.map((file) => {
                return imageRepo.create({
                    url: `${imageBaseUrl}/${file.path.replace(/\\/g, '/')}`
                });
            });
            product.images = images;
        }
        yield productRepo.save(product);
        res.status(201).json({ message: 'Product created successfully', product });
    }
    catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ message: 'Error creating product', error });
    }
});
exports.createProduct = createProduct;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productRepo = (0, typeorm_1.getRepository)(Product_1.Product);
        const product = yield productRepo.findOne({
            where: { id: parseInt(id) },
            relations: ['images']
        });
        res.json(product);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Error fetching products", error });
    }
});
exports.getProduct = getProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, typeorm_1.getRepository)(Product_1.Product).find({ relations: ["images"] });
        res.json(products);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Error fetching products", error });
    }
});
exports.getProducts = getProducts;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { sku, name, price, existingImages } = req.body;
        const productRepo = (0, typeorm_1.getRepository)(Product_1.Product);
        const imageRepo = (0, typeorm_1.getRepository)(Image_1.Image);
        const product = yield productRepo.findOne({ where: { id: +id }, relations: ['images'] });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.sku = sku || product.sku;
        product.name = name || product.name;
        product.price = price || product.price;
        if (existingImages) {
            let parsedExistingImages = [];
            try {
                parsedExistingImages = JSON.parse(existingImages);
            }
            catch (error) {
                console.error('Error parsing existingImages:', error);
                return res.status(400).json({ message: 'Invalid format for existingImages' });
            }
            const retainedImages = product.images.filter((image) => parsedExistingImages.includes(image.url));
            const removedImages = product.images.filter((image) => !parsedExistingImages.includes(image.url));
            const removedImageIds = removedImages.map((image) => image.id);
            if (removedImageIds.length > 0) {
                console.log('Deleting Removed Images...');
                yield imageRepo.delete(removedImageIds);
            }
            product.images = retainedImages;
        }
        else {
            yield imageRepo.delete(product.images.map(image => image.id));
            product.images = [];
        }
        if (req.files && Array.isArray(req.files)) {
            const imageBaseUrl = "http://localhost:3000";
            const images = req.files.map((file) => {
                return imageRepo.create({
                    url: `${imageBaseUrl}/${file.path.replace(/\\/g, '/')}`
                });
            });
            product.images = [...product.images, ...images];
        }
        yield productRepo.save(product);
        const updatedProduct = Object.assign(Object.assign({}, product), { images: product.images.map((image) => ({
                id: image.id,
                url: image.url,
            })) });
        res.json({ message: 'Product updated successfully', product: updatedProduct });
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productRepo = (0, typeorm_1.getRepository)(Product_1.Product);
        const imageRepo = (0, typeorm_1.getRepository)(Image_1.Image);
        yield imageRepo.delete({ product: { id: parseInt(id) } });
        const result = yield productRepo.delete(parseInt(id));
        if (result.affected === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: "Error deleting product", error });
    }
});
exports.deleteProduct = deleteProduct;
