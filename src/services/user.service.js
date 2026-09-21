import userRepository from '../repositories/user.repository.js';
import { USER_ROLES } from '../constants/index.js';

class UserService {
  async getAllUsers() {
    return userRepository.getAll();
  }

  async getUserById(id) {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  async createUser(data) {
    if (!data.name || !data.email) {
      throw new Error('Nombre y email son obligatorios');
    }

    // Me fijo que no exista otro usuario con el mismo email
    const existing = await userRepository.getByEmail(data.email);
    if (existing) {
      throw new Error('Ya existe un usuario con ese email');
    }

    // Si no me pasan rol, le pongo USER por defecto usando la constante
    if (!data.role) {
      data.role = USER_ROLES.USER;
    }

    return userRepository.create(data);
  }

  async updateUser(id, data) {
    const updated = await userRepository.updateById(id, data);
    if (!updated) {
      throw new Error('Usuario no encontrado');
    }
    return updated;
  }

  async deleteUser(id) {
    const deleted = await userRepository.deleteById(id);
    if (!deleted) {
      throw new Error('Usuario no encontrado');
    }
    return deleted;
  }
}

export default new UserService();