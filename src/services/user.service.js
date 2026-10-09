import userRepository from '../repositories/user.repository.js';
import { USER_ROLES } from '../constants/index.js';
import { NotFoundError, ValidationError, ConflictError } from '../errors/index.js';
import { ERROR_MESSAGES } from '../errors/errorDictionary.js';

class UserService {
  async getAllUsers() {
    return userRepository.getAll();
  }

  async getUserById(id) {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  async createUser(data) {
    if (!data.name || !data.email) {
      throw new ValidationError(ERROR_MESSAGES.USER_NAME_EMAIL_REQUIRED);
    }

    const existing = await userRepository.getByEmail(data.email);
    if (existing) {
      throw new ConflictError(ERROR_MESSAGES.USER_EMAIL_IN_USE);
    }

    if (!data.role) {
      data.role = USER_ROLES.USER;
    }

    return userRepository.create(data);
  }

  async updateUser(id, data) {
    const updated = await userRepository.updateById(id, data);
    if (!updated) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return updated;
  }

  async deleteUser(id) {
    const deleted = await userRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return deleted;
  }
}

export default new UserService();