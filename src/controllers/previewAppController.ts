import { Request, Response } from "express";
import { AppDataSource } from "../database/appDataSource";
import { PreviewApp } from "../models/previewApp";
import previewAppServices from "../services/previewAppServices";
import { CreateAPIResponseType } from "../types";

export const getAllPreviewApps = async (_: Request, res: Response) => {
	const previewAppRepo = AppDataSource.getRepository(PreviewApp);
	const previewApps = await previewAppRepo.find();
	res.json(previewApps);
};

export const deployPreviewApp = async (req: Request, res: Response) => {
	const { sourceProjectName, serviceName, branchName, sourceAppId, projectId } = req.body;
	const previewAppRepo = AppDataSource.getRepository(PreviewApp);

	// Search if a preview App with the name branchName-preview already exists
	const existingPreviewApp = await previewAppRepo.findOneBy({
		sourceAppId,
	});

	if (existingPreviewApp) {
		return await previewAppServices.deployApplication(existingPreviewApp.previewAppId, existingPreviewApp.domain, res);
	} else {
		// create a new preview app on Dokploy
		console.log("Creating new preview app on Dokploy");
		// Create a unique name for the preview app
		const previewAppName = `${sourceProjectName}-${serviceName}-${branchName}-preview`;
		const createResponse: CreateAPIResponseType | null = await previewAppServices.createPreviewApp(
			previewAppName,
			previewAppName,
			projectId,
		);

		if (createResponse) {
			// Set up the Docker provider for the preview app
			const dockerImage = `${process.env.DOCKER_REGISTRY_URL}/${sourceProjectName}/${serviceName}/${branchName}:latest`;
			const dockerSetupResponse = await previewAppServices.setUpDockerProvider(
				createResponse.applicationId,
				dockerImage,
			);

			const domain = await previewAppServices.generateDomain(previewAppName);

			const previewApp = previewAppRepo.create({
				projectName: previewAppName,
				sourceAppId,
				previewAppId: createResponse.applicationId,
				dockerImage,
				domain,
			});
			await previewAppRepo.save(previewApp);
			// Use auto deploy
			return previewAppServices.deployApplication(previewApp.previewAppId, domain, res);
		} else {
			res.status(400).json({
				message: "Failed to create preview app on Dokploy",
			});
		}
	}
};

export const deletePreviewApp = async (req: Request, res: Response) => {
	const { previewAppId } = req.body;
	const previewAppRepo = AppDataSource.getRepository(PreviewApp);
	const previewApp = await previewAppRepo.findOneBy({
		previewAppId,
	});

	if (previewApp) {
		await previewAppRepo.remove(previewApp);
		return await previewAppServices.deletePreviewApp(previewApp.previewAppId, res);
	} else {
		return res.status(404).json({ message: "Preview app not found" });
	}
};
