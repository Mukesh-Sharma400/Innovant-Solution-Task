import { createConnection } from "typeorm";

export const connectDB = async () => {
    try {
        await createConnection({
            "type": "postgres",
            "host": "localhost",
            "port": 5432,
            "username": "postgres",
            "password": "postgres",
            "database": "postgres",
            "entities": ["src/entity/*.ts"],
            "synchronize": true
        });
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};
