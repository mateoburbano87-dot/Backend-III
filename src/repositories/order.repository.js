import { OrderModel } from '../models/order.model.js';

class OrderRepository {
  async getAll(page = 1, limit = 20) {
    // Calculamos cuántos registros saltar
    const skip = (page - 1) * limit;
    
    return OrderModel.find()
      .populate('user', '-password')
      .skip(skip)
      .limit(limit);
  }

  async getById(id) {
    return OrderModel.findById(id).populate('user', '-password');
  }

  async create(data) {
    return OrderModel.create(data);
  }

  async updateStatus(id, status) {
    return OrderModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async deleteById(id) {
    return OrderModel.findByIdAndDelete(id);
  }
}

export default new OrderRepository();