import { getRepository } from "typeorm";
import { Image } from "../entity/Image";
import { Request, Response } from "express";
import { Product } from "../entity/Product";

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { sku, name, price } = req.body;
        const productRepo = getRepository(Product);
        const imageRepo = getRepository(Image);

        const product = productRepo.create({
            sku,
            name,
            price: parseFloat(price),
        });

        if (req.files && Array.isArray(req.files)) {
            const imageBaseUrl = "http://localhost:3000";
            const images = (req.files as Express.Multer.File[]).map((file) => {
                return imageRepo.create({
                    url: `${imageBaseUrl}/${file.path.replace(/\\/g, '/')}`
                });
            });

            product.images = images;
        }

        await productRepo.save(product);

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ message: 'Error creating product', error });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productRepo = getRepository(Product);

        const product = await productRepo.findOne({
            where: { id: parseInt(id) },
            relations: ['images']
        });

        res.json(product);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Error fetching products", error });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await getRepository(Product).find({ relations: ["images"] });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Error fetching products", error });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { sku, name, price, existingImages } = req.body;

        const productRepo = getRepository(Product);
        const imageRepo = getRepository(Image);

        const product = await productRepo.findOne({ where: { id: +id }, relations: ['images'] });


        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.sku = sku || product.sku;
        product.name = name || product.name;
        product.price = price || product.price;

        if (existingImages) {
            let parsedExistingImages: string[] = [];
            try {
                parsedExistingImages = JSON.parse(existingImages);
            } catch (error) {
                console.error('Error parsing existingImages:', error);
                return res.status(400).json({ message: 'Invalid format for existingImages' });
            }

            const retainedImages = product.images.filter((image) =>
                parsedExistingImages.includes(image.url)
            );

            const removedImages = product.images.filter((image) =>
                !parsedExistingImages.includes(image.url)
            );

            const removedImageIds = removedImages.map((image) => image.id);

            if (removedImageIds.length > 0) {
                console.log('Deleting Removed Images...');
                await imageRepo.delete(removedImageIds);
            }

            product.images = retainedImages;
        } else {
            await imageRepo.delete(product.images.map(image => image.id));
            product.images = [];
        }

        if (req.files && Array.isArray(req.files)) {
            const imageBaseUrl = "http://localhost:3000";
            const images = (req.files as Express.Multer.File[]).map((file) => {
                return imageRepo.create({
                    url: `${imageBaseUrl}/${file.path.replace(/\\/g, '/')}`
                });
            });

            product.images = [...product.images, ...images];
        }

        await productRepo.save(product);

        const updatedProduct = {
            ...product,
            images: product.images.map((image) => ({
                id: image.id,
                url: image.url,
            })),
        };

        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productRepo = getRepository(Product);
        const imageRepo = getRepository(Image);

        await imageRepo.delete({ product: { id: parseInt(id) } });

        const result = await productRepo.delete(parseInt(id));

        if (result.affected === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: "Error deleting product", error });
    }
};
