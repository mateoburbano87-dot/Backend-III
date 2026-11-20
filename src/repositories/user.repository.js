import { UserModel } from '../models/user.model.js';

class UserRepository {
  async getAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return UserModel.find()
      .select('-password')
      .skip(skip)
      .limit(limit);
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
  
  async createMany(docs) {
    return UserModel.insertMany(docs);
  }

  async updateById(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
  }

  async deleteById(id) {
    return UserModel.findByIdAndDelete(id);
  }
  
  // Método para agregar documentos de archivos
  async addDocument(userId, documentMetadata) {
    return UserModel.findByIdAndUpdate(
      userId,
      { $push: { documents: documentMetadata } },
      { new: true }
    ).select('-password');
  }
}

export default new UserRepository();