import deliveryService from '../services/delivery.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateObjectId } from '../utils/validators.js';

class DeliveryController {
  getAll = asyncHandler(async (req, res) => {
    const deliveries = await deliveryService.getAllDeliveries();
    res.status(200).json(deliveries);
  });

  getById = asyncHandler(async (req, res) => {
    validateObjectId(req.params.id);
    const delivery = await deliveryService.getDeliveryById(req.params.id);
    res.status(200).json(delivery);
  });
}

export default new DeliveryController();