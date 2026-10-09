import productService from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// El controller solo maneja req/res y llama al service.
// Los errores se derivan automáticamente al middleware gracias a asyncHandler.
class ProductController {
  getAll = asyncHandler(async (req, res) => {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  });

  getById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(product);
  });

  create = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  });

  update = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json(product);
  });

  delete = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  });
}

export default new ProductController();