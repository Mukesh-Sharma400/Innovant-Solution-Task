import express from "express";
import multer from "multer";
import { Request, Response } from "express";
import { createProduct, getProducts, updateProduct, deleteProduct, getProduct } from "../controller/productController";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Define routes with proper type handling
router.post("/", upload.array("images", 5), async (req: Request, res: Response) => {
    await createProduct(req, res);
});

router.get("/", async (req: Request, res: Response) => {
    await getProducts(req, res);
});

router.get("/:id", async (req: Request, res: Response) => {
    await getProduct(req, res);
});

router.put("/:id", upload.array("images", 5), async (req: Request, res: Response) => {
    await updateProduct(req, res);
});

router.delete("/:id", async (req: Request, res: Response) => {
    await deleteProduct(req, res);
});

export default router;
