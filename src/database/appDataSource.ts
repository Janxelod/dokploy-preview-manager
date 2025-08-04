import "reflect-metadata";
import { DataSource } from "typeorm";
import { PreviewApp } from "../models/previewApp";

const dbPath = process.env.DB_PATH || "db.sqlite";

export const AppDataSource = new DataSource({
	type: "sqlite",
	database: dbPath,
	synchronize: process.env.NODE_ENV !== "prod",
	entities: [PreviewApp],
});
