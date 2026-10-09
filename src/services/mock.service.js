import userRepository from '../repositories/user.repository.js';
import orderRepository from '../repositories/order.repository.js';
import deliveryRepository from '../repositories/delivery.repository.js';
import {
  generateMockUser,
  generateMockOrder,
  generateMockDelivery,
} from '../utils/mockGenerator.js';
import { USER_ROLES } from '../constants/index.js';
import { ValidationError, DatabaseError, BadRequestError } from '../errors/index.js';
import { ERROR_MESSAGES } from '../errors/errorDictionary.js';

class MockService {
  // ---- Validaciones internas ----

  // Chequeo que qty sea un entero positivo. Lo uso en todos los métodos.
  validateQty(qty) {
    const n = Number(qty);
    if (!Number.isInteger(n) || n <= 0) {
      throw new ValidationError(ERROR_MESSAGES.MOCK_INVALID_QTY);
    }
    // Le pongo un tope razonable para no reventar la memoria
    if (n > 100) {
      throw new ValidationError('La cantidad máxima permitida es 100');
    }
    return n;
  }

  // ---- Generación SIN guardar ----

  getMockUsers(qty = 5) {
    const total = this.validateQty(qty);
    const users = [];
    for (let i = 0; i < total; i++) {
      const role = i % 2 === 0 ? USER_ROLES.CLIENTE : USER_ROLES.REPARTIDOR;
      users.push(generateMockUser(role));
    }
    return users;
  }

  getMockOrders(qty = 5) {
    const total = this.validateQty(qty);
    const orders = [];
    for (let i = 0; i < total; i++) {
      orders.push(generateMockOrder('000000000000000000000000'));
    }
    return orders;
  }

  getMockDeliveries(qty = 5) {
    const total = this.validateQty(qty);
    const deliveries = [];
    for (let i = 0; i < total; i++) {
      deliveries.push(generateMockDelivery('000000000000000000000000'));
    }
    return deliveries;
  }

  // ---- Seed real en Mongo ----

  async seedUsers(qty = 5) {
    const total = this.validateQty(qty);
    const users = this.getMockUsers(total);

    try {
      const inserted = await userRepository.createMany(users);
      return { insertados: inserted.length, coleccion: 'users' };
    } catch (error) {
      // Envolvemos el error de Mongo en uno nuestro para no filtrar detalles
      throw new DatabaseError(ERROR_MESSAGES.MOCK_SEED_FAILED);
    }
  }

  async seedOrders(qty = 5) {
    const total = this.validateQty(qty);

    // Si no hay usuarios, creo algunos primero
    let users = await userRepository.getAll();
    if (users.length === 0) {
      await this.seedUsers(3);
      users = await userRepository.getAll();
    }

    const orders = [];
    for (let i = 0; i < total; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      orders.push(generateMockOrder(user._id));
    }

    try {
      const inserted = await orderRepository.createMany(orders);
      return { insertados: inserted.length, coleccion: 'orders' };
    } catch (error) {
      throw new DatabaseError(ERROR_MESSAGES.MOCK_SEED_FAILED);
    }
  }

  async seedDeliveries(qty = 5) {
    const total = this.validateQty(qty);

    // Necesito órdenes primero
    let orders = await orderRepository.getAll();
    if (orders.length === 0) {
      await this.seedOrders(3);
      orders = await orderRepository.getAll();
    }

    // Y repartidores
    const users = await userRepository.getAll();
    const repartidores = users.filter((u) => u.role === USER_ROLES.REPARTIDOR);

    const deliveries = [];
    for (let i = 0; i < total; i++) {
      const order = orders[Math.floor(Math.random() * orders.length)];
      const repartidor =
        repartidores.length > 0
          ? repartidores[Math.floor(Math.random() * repartidores.length)]
          : null;

      deliveries.push(generateMockDelivery(order._id, repartidor?._id ?? null));
    }

    try {
      const inserted = await deliveryRepository.createMany(deliveries);
      return { insertados: inserted.length, coleccion: 'deliveries' };
    } catch (error) {
      throw new DatabaseError(ERROR_MESSAGES.MOCK_SEED_FAILED);
    }
  }

  // Chequeo que la colección pasada por URL sea válida
  validateCollection(collection) {
    const allowed = ['users', 'orders', 'deliveries'];
    if (!allowed.includes(collection)) {
      throw new BadRequestError(ERROR_MESSAGES.MOCK_COLLECTION_NOT_SUPPORTED);
    }
    return collection;
  }
}

export default new MockService();