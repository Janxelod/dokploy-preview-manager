import { Response } from "express";
import { PreviewApp } from "../models/previewApp";
import { CreateAPIResponseType } from "../types";

const deployApplication = async (previewApp: PreviewApp, res: Response): Promise<Response | null> => {
	await copyEnvVars(previewApp.sourceAppId, previewApp.previewAppId);
	const deployResponse = await deployApplicationInternal(previewApp.previewAppId);
	if (deployResponse && deployResponse.status === 200) {
		return res.status(200).json({
			message: `Preview app deployed`,
			previewDomain: previewApp.domain,
		});
	} else {
		return res.status(400).json({
			message: "Failed to deploy preview app",
		});
	}
};

const deployApplicationInternal = async (appId: string) => {
	try {
		const response = await fetch(`${process.env.DOKPLOY_API_URL}/application.deploy`, {
			headers: getHeaders(),
			body: JSON.stringify({
				applicationId: appId,
			}),
			method: "POST",
		});
		console.log("Deploy response status:", response);
		return {
			status: response.status,
			response: response.body,
		};
	} catch (error) {
		console.error("Error deploying application:", error);
		return null;
	}
};

const createPreviewApp = async (
	name: string,
	appName: string,
	projectId: string,
): Promise<CreateAPIResponseType | null> => {
	try {
		const response = await fetch(`${process.env.DOKPLOY_API_URL}/application.create`, {
			headers: getHeaders(),
			body: JSON.stringify({
				name,
				appName,
				projectId,
			}),
			method: "POST",
		});
		return (await response.json()) as CreateAPIResponseType;
	} catch (error) {
		console.error("Error creating preview app:", error);
		return null;
	}
};

const setUpDockerProvider = async (appId: string, dockerImage: string) => {
	try {
		const response = await fetch(`${process.env.DOKPLOY_API_URL}/application.saveDockerProvider`, {
			headers: getHeaders(),
			body: JSON.stringify({
				applicationId: appId,
				dockerImage: dockerImage,
				password: process.env.DOCKER_PROVIDER_PASSWORD,
				username: process.env.DOCKER_PROVIDER_USERNAME,
				registryUrl: process.env.DOCKER_REGISTRY_URL,
			}),
			method: "POST",
		});
		return await response.json();
	} catch (error) {
		console.error("Error setting up Docker provider:", error);
		return null;
	}
};

const deletePreviewApp = async (appId: string, res: Response) => {
	try {
		const response = await fetch(`${process.env.DOKPLOY_API_URL}/application.delete`, {
			headers: getHeaders(),
			body: JSON.stringify({
				applicationId: appId,
			}),
			method: "POST",
		});

		if (response.ok) {
			return res.status(200).send();
		} else {
			return res.status(400).json({
				message: "Failed to delete preview app",
			});
		}
	} catch (error) {
		console.error("Error deleting preview app:", error);
	}
};

const generateDomain = async (previewAppName: string) => {
	const response = await fetch(`${process.env.DOKPLOY_API_URL}/domain.generateDomain	`, {
		headers: getHeaders(),
		body: JSON.stringify({
			appName: previewAppName,
		}),
		method: "POST",
	});

	const result = await response.json();
	return result || "";
};

const attachDomain = async (previewAppId: string, domain: string) => {
	const response = await fetch(`${process.env.DOKPLOY_API_URL}/domain.create	`, {
		headers: getHeaders(),
		body: JSON.stringify({
			applicationId: previewAppId,
			host: domain,
			domaintType: "application",
			https: false,
			stripPath: false,
			domainId: "",
		}),
		method: "POST",
	});
	const result = await response.json();
	console.log("Domain creation response status:", result);
	return result || "";
};

const copyEnvVars = async (sourceAppId: string, previewAppId: string) => {
	const responseApplicationOne = await fetch(
		`${process.env.DOKPLOY_API_URL}/application.one?applicationId=${sourceAppId}`,
		{
			headers: getHeaders(),
			method: "GET",
		},
	);

	const result = await responseApplicationOne.json();
	const sourceEnv = result.env;

	const response = await fetch(`${process.env.DOKPLOY_API_URL}/application.saveEnvironment`, {
		headers: getHeaders(),
		body: JSON.stringify({
			applicationId: previewAppId,
			env: sourceEnv,
			buildArgs: "",
		}),
		method: "POST",
	});

	const finalResult = await response.json();

	if (finalResult.status !== 200) {
		console.error("Error copying environment variables:", finalResult);
	}
};

const getHeaders = () => {
	return {
		"x-api-key": `${process.env.DOKPLOY_API_KEY}`,
		Accept: "application/json",
		"Content-Type": "application/json",
	};
};

export default {
	deployApplication,
	createPreviewApp,
	setUpDockerProvider,
	deletePreviewApp,
	generateDomain,
	attachDomain,
};
