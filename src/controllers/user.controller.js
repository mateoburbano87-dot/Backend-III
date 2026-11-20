import userService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class UserController {
  getAll = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const users = await userService.getAllUsers(page, limit);
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