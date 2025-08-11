import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";

class JWTService {
	constructor() {
		console.log("JWTService initialized");
	}

	public generateToken(user: User): string {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error("JWT secret is not defined");
		}
		const payload = { sub: user.id, name: user.userName };

		return jwt.sign(payload, secret, { expiresIn: "15m" });
	}

	public verifyToken(token: string, callBack: (err: jwt.VerifyErrors | null, decoded: JwtPayload | undefined) => void) {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error("JWT secret is not defined");
		}
		try {
			return jwt.verify(token, secret, callBack);
		} catch (error) {
			console.error("Token verification failed:", error);
			return null;
		}
	}
}

export default new JWTService();
