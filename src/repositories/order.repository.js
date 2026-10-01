import { OrderModel } from '../models/order.model.js';

class OrderRepository {
  async getAll() {
    return OrderModel.find().populate('user', '-password');
  }

  async getById(id) {
    return OrderModel.findById(id).populate('user', '-password');
  }

  async create(data) {
    return OrderModel.create(data);
  }

  // Lo uso en el seed para insertar varios de una
  async createMany(docs) {
    return OrderModel.insertMany(docs);
  }

  async deleteAll() {
    return OrderModel.deleteMany({});
  }
}

export default new OrderRepository();