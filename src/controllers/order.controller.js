import orderService from '../services/order.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateObjectId, requireFields } from '../utils/validators.js';

class OrderController {
  getAll = asyncHandler(async (req, res) => {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  });

  getById = asyncHandler(async (req, res) => {
    validateObjectId(req.params.id);
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json(order);
  });

  create = asyncHandler(async (req, res) => {
    requireFields(req.body, ['user']);
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  });

  updateStatus = asyncHandler(async (req, res) => {
    validateObjectId(req.params.id);
    requireFields(req.body, ['status']);
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    res.status(200).json(order);
  });

  delete = asyncHandler(async (req, res) => {
    validateObjectId(req.params.id);
    await orderService.deleteOrder(req.params.id);
    res.status(204).send();
  });
}

export default new OrderController();