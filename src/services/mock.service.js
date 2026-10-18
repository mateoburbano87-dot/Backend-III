import logger from '../config/logger.config.js';

// ... resto de imports igual

class MockService {
  // ... validateQty y validateCollection igual

  getMockUsers(qty = 5) {
    const total = this.validateQty(qty);
    logger.debug(`Generando ${total} usuarios mock (sin guardar)`);
    const users = [];
    for (let i = 0; i < total; i++) {
      const role = i % 2 === 0 ? USER_ROLES.CLIENTE : USER_ROLES.REPARTIDOR;
      users.push(generateMockUser(role));
    }
    return users;
  }

  // ... getMockOrders y getMockDeliveries similares, sin log o con debug

  async seedUsers(qty = 5) {
    const total = this.validateQty(qty);
    const users = this.getMockUsers(total);

    try {
      const inserted = await userRepository.createMany(users);
      logger.info(`Seed: ${inserted.length} usuarios insertados en Mongo`);
      return { insertados: inserted.length, coleccion: 'users' };
    } catch (error) {
      logger.error(`Error en seedUsers: ${error.message}`);
      throw new DatabaseError(ERROR_MESSAGES.MOCK_SEED_FAILED);
    }
  }

  async seedOrders(qty = 5) {
    const total = this.validateQty(qty);
    logger.info(`Iniciando seed de ${total} pedidos`);

    // ... lógica igual

    try {
      const inserted = await orderRepository.createMany(orders);
      logger.info(`Seed: ${inserted.length} pedidos insertados`);
      return { insertados: inserted.length, coleccion: 'orders' };
    } catch (error) {
      logger.error(`Error en seedOrders: ${error.message}`);
      throw new DatabaseError(ERROR_MESSAGES.MOCK_SEED_FAILED);
    }
  }

  async seedDeliveries(qty = 5) {
    const total = this.validateQty(qty);
    logger.info(`Iniciando seed de ${total} entregas`);

    // ... lógica igual

    try {
      const inserted = await deliveryRepository.createMany(deliveries);
      logger.info(`Seed: ${inserted.length} entregas insertadas`);
      return { insertados: inserted.length, coleccion: 'deliveries' };
    } catch (error) {
      logger.error(`Error en seedDeliveries: ${error.message}`);
      throw new DatabaseError(ERROR_MESSAGES.MOCK_SEED_FAILED);
    }
  }
}

export default new MockService();