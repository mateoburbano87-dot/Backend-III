import userService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class UserController {
  getAll = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  });

  getById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  });

  create = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  });

  update = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  });

  delete = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  });
}

export default new UserController();