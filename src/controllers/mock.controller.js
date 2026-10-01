import mockService from '../services/mock.service.js';

class MockController {
  // GET /api/mocks/users?qty=5 -> devuelve datos sin guardar
  getUsers(req, res) {
    try {
      const qty = Number(req.query.qty) || 5;
      const users = mockService.getMockUsers(qty);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  getOrders(req, res) {
    try {
      const qty = Number(req.query.qty) || 5;
      const orders = mockService.getMockOrders(qty);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  getDeliveries(req, res) {
    try {
      const qty = Number(req.query.qty) || 5;
      const deliveries = mockService.getMockDeliveries(qty);
      res.status(200).json(deliveries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/mocks/seed/:collection?qty=10 -> inserta en Mongo
  async seed(req, res) {
    try {
      const { collection } = req.params;
      const qty = Number(req.query.qty) || 5;

      let result;

      switch (collection) {
        case 'users':
          result = await mockService.seedUsers(qty);
          break;
        case 'orders':
          result = await mockService.seedOrders(qty);
          break;
        case 'deliveries':
          result = await mockService.seedDeliveries(qty);
          break;
        default:
          return res.status(400).json({ message: 'Colección no soportada' });
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new MockController();