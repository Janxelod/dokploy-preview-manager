import "module-alias/register";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { PreviewApp } from "../models/previewApp";

export const AppDataSource = new DataSource({
	type: "sqlite",
	database: "db.sqlite",
	synchronize: true,
	entities: [PreviewApp],
});
