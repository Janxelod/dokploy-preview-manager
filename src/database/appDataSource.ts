import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { PreviewApp } from "../models/previewApp";

const prodPath = path.resolve("/", "data", "db", "db.sqlite");

const dbPath = process.env.NODE_ENV === "prod" ? prodPath : "db.sqlite";

export const AppDataSource = new DataSource({
	type: "sqlite",
	database: dbPath,
	synchronize: true,
	entities: [PreviewApp],
});
