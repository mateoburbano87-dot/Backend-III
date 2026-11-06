import deliveryRepository from '../repositories/delivery.repository.js';
import { NotFoundError } from '../errors/index.js';

class DeliveryService {
  async getAllDeliveries() {
    return deliveryRepository.getAll();
  }

  async getDeliveryById(id) {
    const delivery = await deliveryRepository.getById(id);
    if (!delivery) {
      throw new NotFoundError('Entrega no encontrada');
    }
    return delivery;
  }
}

export default new DeliveryService();