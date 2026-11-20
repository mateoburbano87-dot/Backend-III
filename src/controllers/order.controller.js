import orderService from '../services/order.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class OrderController {
  getAll = asyncHandler(async (req, res) => {
    // Parseamos los query params para la paginación
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    // Llamamos al servicio pasando la paginación
    const orders = await orderService.getAllOrders(page, limit);
    res.status(200).json(orders);
  });

  getById = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json(order);
  });

  create = asyncHandler(async (req, res) => {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  });

  updateStatus = asyncHandler(async (req, res) => {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.status(200).json(order);
  });

  delete = asyncHandler(async (req, res) => {
    await orderService.deleteOrder(req.params.id);
    res.status(204).send();
  });
}

export default new OrderController();