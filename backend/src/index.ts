import cors from "cors";
import path from 'path';
import express from "express";
import { connectDB } from "./config/database";

const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

connectDB();

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

import productRoutes from "./routes/productRoutes";

app.use("/api/products", productRoutes);
