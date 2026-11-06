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

  async createMany(docs) {
    return OrderModel.insertMany(docs);
  }

  async updateById(id, data) {
    return OrderModel.findByIdAndUpdate(id, data, { new: true }).populate('user', '-password');
  }

  async deleteById(id) {
    return OrderModel.findByIdAndDelete(id);
  }

  async deleteAll() {
    return OrderModel.deleteMany({});
  }
}

export default new OrderRepository();