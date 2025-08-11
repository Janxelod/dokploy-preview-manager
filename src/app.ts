import dotenv from "dotenv";
import express from "express";
import path from "path";
import { AppDataSource } from "./database/appDataSource";
import "./extensions"; // Ensure the extensions are loaded
import { authMiddleware } from "./middleware/authMiddleware";
import authRoutes from "./routes/authRoutes";
import previewAppRoutes from "./routes/previewAppRoutes";

const envFilePath = process.env.ENV_FILE || ".env";
dotenv.config({ path: path.resolve(envFilePath) });

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", authMiddleware, previewAppRoutes);
app.use("/auth", authRoutes);

AppDataSource.initialize()
	.then(() => {
		console.log("Connected to DB");
		app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
	})
	.catch(err => console.error("DB connection failed:", err));
