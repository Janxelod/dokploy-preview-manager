import { Request, Response } from "express";
import authService from "../services/authService";

export const loginUser = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const accessToken = await authService.login(username, password);

	if (accessToken) {
		return res.json({ accessToken });
	}

	return res.status(401).json({ error: "Invalid credentials" });
};
