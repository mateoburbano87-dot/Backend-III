import userRepository from '../repositories/user.repository.js';
import orderRepository from '../repositories/order.repository.js';
import deliveryRepository from '../repositories/delivery.repository.js';
import {
  generateMockUser,
  generateMockOrder,
  generateMockDelivery,
} from '../utils/mockGenerator.js';
import { USER_ROLES } from '../constants/index.js';

class MockService {
  // ---- Generación de datos SIN guardar ----

  getMockUsers(qty = 5) {
    const users = [];
    for (let i = 0; i < qty; i++) {
      // Mezclo roles para que se vea variado
      const role = i % 2 === 0 ? USER_ROLES.CLIENTE : USER_ROLES.REPARTIDOR;
      users.push(generateMockUser(role));
    }
    return users;
  }

  getMockOrders(qty = 5) {
    const orders = [];
    // Uso un id falso porque no estamos guardando nada
    for (let i = 0; i < qty; i++) {
      orders.push(generateMockOrder('000000000000000000000000'));
    }
    return orders;
  }

  getMockDeliveries(qty = 5) {
    const deliveries = [];
    for (let i = 0; i < qty; i++) {
      deliveries.push(generateMockDelivery('000000000000000000000000'));
    }
    return deliveries;
  }

  // ---- Carga de datos REALES en Mongo ----

  async seedUsers(qty = 5) {
    const users = this.getMockUsers(qty);
    const inserted = await userRepository.createMany(users);
    return { insertados: inserted.length, coleccion: 'users' };
  }

  async seedOrders(qty = 5) {
    // Para que las órdenes tengan usuario real, primero me aseguro de tener algunos
    let users = await userRepository.getAll();
    if (users.length === 0) {
      await this.seedUsers(3);
      users = await userRepository.getAll();
    }

    const orders = [];
    for (let i = 0; i < qty; i++) {
      // Le asigno un usuario random de los que ya existen
      const user = users[Math.floor(Math.random() * users.length)];
      orders.push(generateMockOrder(user._id));
    }

    const inserted = await orderRepository.createMany(orders);
    return { insertados: inserted.length, coleccion: 'orders' };
  }

  async seedDeliveries(qty = 5) {
    // Necesito órdenes primero
    let orders = await orderRepository.getAll();
    if (orders.length === 0) {
      await this.seedOrders(3);
      orders = await orderRepository.getAll();
    }

    // Y también repartidores
    const users = await userRepository.getAll();
    const repartidores = users.filter((u) => u.role === USER_ROLES.REPARTIDOR);

    const deliveries = [];
    for (let i = 0; i < qty; i++) {
      const order = orders[Math.floor(Math.random() * orders.length)];
      // Le asigno un repartidor solo si hay alguno disponible
      const repartidor = repartidores.length > 0
        ? repartidores[Math.floor(Math.random() * repartidores.length)]
        : null;

      deliveries.push(generateMockDelivery(order._id, repartidor?._id ?? null));
    }

    const inserted = await deliveryRepository.createMany(deliveries);
    return { insertados: inserted.length, coleccion: 'deliveries' };
  }
}

export default new MockService();