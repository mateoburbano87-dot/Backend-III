// En src/controllers/order.controller.js (o user)
  getAll = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    
    // Asumiendo que el service tiene un método con skip y limit
    const orders = await orderService.getAllOrders(page, limit);
    res.status(200).json(orders);
  });