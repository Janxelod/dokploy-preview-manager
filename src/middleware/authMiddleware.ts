import { NextFunction, Request, Response } from "express";
import jwtService from "../services/jwtService";

interface AuthenticatedRequest extends Request {
	user?: any;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

	if (!token) {
		return res.status(401).json({ error: "No token provided" });
	}

	jwtService.verifyToken(token, (err, decoded) => {
		if (err) return res.status(403).json({ error: "Invalid or expired token" });
		req.user = decoded;
		console.log("Authenticated user:", req.user);
		next();
	});
}
