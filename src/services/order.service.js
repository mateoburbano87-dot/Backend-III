import orderRepository from '../repositories/order.repository.js';
import userRepository from '../repositories/user.repository.js';
import { ORDER_STATUS } from '../constants/index.js';
import { NotFoundError, ValidationError } from '../errors/index.js';
import logger from '../config/logger.config.js';

class OrderService {
  async getAllOrders() {
    return orderRepository.getAll();
  }

  async getOrderById(id) {
    const order = await orderRepository.getById(id);
    if (!order) {
      throw new NotFoundError('Pedido no encontrado');
    }
    return order;
  }

  async createOrder(data) {
    // Valido que el usuario exista antes de crear el pedido
    const user = await userRepository.getById(data.user);
    if (!user) {
      throw new ValidationError('El usuario indicado no existe');
    }

    const order = await orderRepository.create({
      user: data.user,
      products: data.products ?? [],
      status: data.status ?? ORDER_STATUS.PENDING,
      priority: data.priority,
    });

    logger.info(`Pedido creado: ${order._id}`);
    return order;
  }

  async updateStatus(id, status) {
    // Valido que el estado esté entre los permitidos por las constantes
    const validStatuses = Object.values(ORDER_STATUS);
    if (!validStatuses.includes(status)) {
      throw new ValidationError(
        `Estado inválido. Valores permitidos: ${validStatuses.join(', ')}`
      );
    }

    const updated = await orderRepository.updateById(id, { status });
    if (!updated) {
      throw new NotFoundError('Pedido no encontrado');
    }
    logger.info(`Pedido ${id} actualizado a estado ${status}`);
    return updated;
  }

  async deleteOrder(id) {
    const deleted = await orderRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError('Pedido no encontrado');
    }
    return deleted;
  }
}

export default new OrderService();