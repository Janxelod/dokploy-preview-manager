import { deletePreviewApp, deployPreviewApp, getAllPreviewApps } from "@src/controllers/previewAppController";

import { Router } from "express";

const router = Router();

router.post("/deploy-preview-app", deployPreviewApp);
router.get("/preview-apps", getAllPreviewApps);
router.delete("/preview-apps", deletePreviewApp);

export default router;
