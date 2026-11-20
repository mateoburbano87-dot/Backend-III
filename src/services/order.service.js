import orderRepository from '../repositories/order.repository.js';
import { NotFoundError, ValidationError } from '../errors/index.js';
import { ERROR_MESSAGES } from '../errors/errorDictionary.js';

class OrderService {
  async getAllOrders(page = 1, limit = 20) {
    return orderRepository.getAll(page, limit);
  }

  async getOrderById(id) {
    const order = await orderRepository.getById(id);
    if (!order) {
      throw new NotFoundError('Orden no encontrada');
    }
    return order;
  }

  async createOrder(data) {
    if (!data.user || !data.products) {
      throw new ValidationError('Usuario y productos son obligatorios');
    }
    return orderRepository.create(data);
  }

  async updateOrderStatus(id, status) {
    const updated = await orderRepository.updateStatus(id, status);
    if (!updated) {
      throw new NotFoundError('Orden no encontrada');
    }
    return updated;
  }

  async deleteOrder(id) {
    const deleted = await orderRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError('Orden no encontrada');
    }
    return deleted;
  }
}

export default new OrderService();