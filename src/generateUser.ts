import { AppDataSource } from "./database/appDataSource";
import { User } from "./models/user";
import userService from "./services/userService";

const createNewUser = async (userName: string, password: string): Promise<User> => {
	const newUser = await userService.createUser({ userName, password });
	console.log(`User created: ${newUser.userName} with ID: ${newUser.id}`);
	return newUser;
};
AppDataSource.initialize()
	.then(() => {
		console.log("Connected to DB");
		// CLI usage: npm run create-user -- username password
		const args = process.argv.slice(2);
		if (args.length < 2) {
			console.error("Usage: npm run create-user -- <username> <password>");
			process.exit(1);
		}

		createNewUser(args[0], args[1])
			.then(() => process.exit(0))
			.catch(err => {
				console.error("Error creating user:", [err]);
				process.exit(1);
			});
	})
	.catch(err => console.error("DB connection failed:", [err]));
