import "module-alias/register";
import "reflect-metadata";
import { PreviewApp } from "src/models/previewApp";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "sqlite",
	database: "db.sqlite",
	synchronize: true,
	entities: [PreviewApp],
});
