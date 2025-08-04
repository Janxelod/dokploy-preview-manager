import "express";

declare module "express" {
  export interface Request {
    branchName?: string;
    sourceAppId?: string;
  }
}
