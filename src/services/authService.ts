import { User } from "../models/user";
import jwtService from "./jwtService";
import passwordService from "./passwordService";
import userService from "./userService";
class AuthService {
	constructor() {}
	public async login(userName: string, password: string): Promise<string> {
		const user = await userService.findUser(userName);

		if (!user) {
			throw new Error("User does not exists !");
		}

		if (!(await passwordService.verify(password, user.password))) {
			throw new Error("Invalid credentials");
		}

		return this.generateToken(user);
	}

	private generateToken(user: User): string {
		return jwtService.generateToken(user);
	}
}

export default new AuthService();
