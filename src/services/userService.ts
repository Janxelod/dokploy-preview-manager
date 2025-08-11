import { AppDataSource } from "../database/appDataSource";
import { CreateUserDto } from "../dtos/createUserDto";
import { User } from "../models/user";
import passwordService from "./passwordService";

class UserService {
	private userRepository = AppDataSource.getRepository(User);

	constructor() {
		console.log("UserService initialized");
	}

	public async createUser(createUserDto: CreateUserDto) {
		const hashedPassword = await passwordService.hash(createUserDto.password);

		const user = this.userRepository.create({
			...createUserDto,
			password: hashedPassword,
		});

		return await this.userRepository.save(user);
	}

	public async findUser(userName: string) {
		return await this.userRepository.findOneBy({ userName });
	}

	public async deleteUser(userId: string) {
		return await this.userRepository.delete(userId);
	}
}

export default new UserService();
