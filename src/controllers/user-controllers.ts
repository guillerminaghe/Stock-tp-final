import { Request, Response } from "express";
import { validateUser, validatePartialUser } from "../schemas/user-schema";
import UserModel from "../models/user-model";

abstract class UserController {
  static async login(req: Request, res: Response) {
    const validatedData = validatePartialUser(req.body);

    if (!validatedData.success)
      return res
        .status(400)
        .json({ error: JSON.parse(validatedData.error.message) });

    const userLogged = await UserModel.login(req.body);

    
    if (userLogged === 404)
      return res.status(404).json({ message: "Username does not exists..." });

    
    if (userLogged === 400)
      return res.status(400).json({ message: "Wrong password" });

    
    res
      .status(201)
      .json({ message: "User logged successully", token: userLogged });
  }

  static async logout(req: Request, res: Response) {
    const validatedData = validatePartialUser(req.body);

    if (!validatedData.success)
      return res
        .status(400)
        .json({ error: JSON.parse(validatedData.error.message) });

    const userLoggedout = await UserModel.logout(req.body);

    if (userLoggedout === 400)
      return res.status(400).json({ message: "Username already exists..." });

    res.status(201).json(userLoggedout);
  }

  static async createUser(req: Request, res: Response) {
    const validatedData = validateUser(req.body);

    if (!validatedData.success)
      return res
        .status(400)
        .json({ error: JSON.parse(validatedData.error.message) });

    const newUser = await UserModel.createUser(req.body);

    if (newUser === 400)
      return res.status(400).json({ message: "Username already exists..." });

    res.status(201).json(newUser);
  }

  static async getAll(req: Request, res: Response) {
    const users = await UserModel.getAll();
    res.json(users);
  }

  static async update(req: Request, res: Response) {
    const { username } = req.params;
    const { email, password } = req.body;
    const validatedData = validatePartialUser({ username, email, password });

    if (!validatedData.success)
      return res
        .status(400)
        .json({ error: JSON.parse(validatedData.error.message) });

    const userUpdated = await UserModel.update({ username, email, password });

    if (userUpdated === 404)
      return res
        .status(404)
        .json({ message: "Wrong ID, user does not exists" });

    res.status(200).json({ message: "User updated successfully", userUpdated });
  }

  static async delete(req: Request, res: Response) {
    const { username } = req.params;
    const userDeleted = await UserModel.delete(username);

    if (userDeleted === 404)
      return res.status(404).json({ message: "Wrong username..." });

    res.status(200).json({ message: "User deleted successfully", userDeleted });
  }
}

export default UserController;
