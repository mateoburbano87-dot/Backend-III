import logger from '../config/logger.config.js';

class ProductService {
  // ... resto igual

  async createProduct(data) {
    if (!data.name || data.price === undefined) {
      logger.warning('Intento de crear producto sin nombre o precio');
      throw new ValidationError(ERROR_MESSAGES.PRODUCT_NAME_PRICE_REQUIRED);
    }

    // ... resto igual

    const product = await productRepository.create(data);
    logger.info(`Producto creado: ${product._id}`);
    return product;
  }

  async getProductById(id) {
    const product = await productRepository.getById(id);
    if (!product) {
      logger.warning(`Producto no encontrado: ${id}`);
      throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return product;
  }
}

export default new ProductService();