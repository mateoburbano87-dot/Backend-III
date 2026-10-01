import { UserModel } from '../models/user.model.js';

class UserRepository {
  async getAll() {
    // Por defecto no traigo el campo password (aunque todavía no lo tengo, es buena práctica)
    return UserModel.find().select('-password');
  }

  async getById(id) {
    return UserModel.findById(id).select('-password');
  }

  async getByEmail(email) {
    return UserModel.findOne({ email });
  }

  async create(data) {
    return UserModel.create(data);
  }

  // Lo uso en el seed de mocks
  async createMany(docs) {
    return UserModel.insertMany(docs);
  }

  async updateById(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
  }

  async deleteById(id) {
    return UserModel.findByIdAndDelete(id);
  }
}

export default new UserRepository();