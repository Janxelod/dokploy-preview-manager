import "express";

export type ReplaceEnvVarType = {
	key: string;
	newValue: string;
};

export type DeployPreviewAppOptions = {
	replaceEnvVar: ReplaceEnvVarType;
};

interface ReqBody {
	// Define your request body structure here
	[key: string]: any;
	branchName: string;
	sourceAppId: string;
	sourceProjectName: string;
	serviceName: string;
	projectId: string;
	options: DeployPreviewAppOptions;
}

declare module "express" {
	export interface Request {
		branchName?: string;
		sourceAppId?: string;
		body: ReqBody;
	}
}
