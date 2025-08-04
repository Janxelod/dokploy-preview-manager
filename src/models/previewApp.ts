import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PreviewApp {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar" })
	projectName: string;

	@Column({ type: "varchar" })
	sourceAppId: string;

	@Column({ type: "varchar" })
	previewAppId: string;

	@Column({ type: "text" })
	dockerImage: string;
}
