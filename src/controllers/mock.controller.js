import mockService from '../services/mock.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class MockController {
  // GET /api/mocks/users?qty=5
  getUsers = asyncHandler(async (req, res) => {
    const users = mockService.getMockUsers(req.query.qty);
    res.status(200).json(users);
  });

  getOrders = asyncHandler(async (req, res) => {
    const orders = mockService.getMockOrders(req.query.qty);
    res.status(200).json(orders);
  });

  getDeliveries = asyncHandler(async (req, res) => {
    const deliveries = mockService.getMockDeliveries(req.query.qty);
    res.status(200).json(deliveries);
  });

  // POST /api/mocks/seed/:collection?qty=10
  seed = asyncHandler(async (req, res) => {
    const { collection } = req.params;
    const qty = req.query.qty;

    // Valido la colección en el service (ahí vive la regla)
    mockService.validateCollection(collection);

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
    }

    res.status(201).json(result);
  });
}

export default new MockController();