import { DeliveryModel } from '../models/delivery.model.js';

class DeliveryRepository {
  async getAll() {
    return DeliveryModel.find()
      .populate('order')
      .populate('repartidor', '-password');
  }

  async getById(id) {
    return DeliveryModel.findById(id)
      .populate('order')
      .populate('repartidor', '-password');
  }

  async create(data) {
    return DeliveryModel.create(data);
  }

  async createMany(docs) {
    return DeliveryModel.insertMany(docs);
  }

  async deleteAll() {
    return DeliveryModel.deleteMany({});
  }
}

export default new DeliveryRepository();