import users from '../database/users.json';
import { writeFile } from 'jsonfile';
import { randomUUID } from 'node:crypto';

abstract class UserModel {
	
	private static findUser(username: string) {
		return users.find((user) => user.username === username);
	}

	private static async writeDB() {
		return writeFile('./src/database/users.json', users);
	}

	static async checkToken(token: string) {
		return users.find((user) => user.token === token);
	}

	static async login(userData: any) {
		const { username, password } = userData;

		const userFound = this.findUser(username);

		
		if (!userFound) return 404;

		if (userFound.password !== password) return 400;

		
		const token = randomUUID();

		
		userFound.token = token;
		this.writeDB();

		return token;
	}

	static async logout(userData: any) {
		const { username } = userData;
		const user = this.findUser(username);

		if (!user) return 400;
		user.token = '';

		
		await this.writeDB();

		return 200;
	}

	static async createUser(data: any) {
		const { username, email, password } = data;

		const userExists = this.findUser(username);
		if (userExists) return 400;

		const newUser = { username, email, password, token: '' };
		users.push(newUser);

		await this.writeDB();

		
		return { username, email };
	}

	static async getAll() {
		return users;
	}

	static async update(data: any) {
		

		const { username, email, password } = data;

		const userFound = this.findUser(username);

		console.log(username);
		console.log(userFound);

		if (!userFound) return 404;

		
		if (username) userFound.username = username;
		if (email) userFound.email = email;
		if (password) userFound.password = password;

		await this.writeDB();

		return userFound;
	}

	static async delete(username: string) {
		

		const userFoundIndex = users.findIndex(
			(user) => user.username === username
		);

		if (userFoundIndex === -1) return 404;

		const userDeleted = users[userFoundIndex];
		users.splice(userFoundIndex, 1);

		await this.writeDB();

		return userDeleted;
	}
}

export default UserModel;
