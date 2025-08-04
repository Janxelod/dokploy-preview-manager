export interface DeployAPIResponse {
  message: string;
  code: string;
  issues?: {
    message: string;
  }[];
}

export interface DeployAPIResponseType {
  response: DeployAPIResponse;
  status: number;
}

export interface CreateAPIResponseType {
  appName: string;
  applicationId: string;
}
