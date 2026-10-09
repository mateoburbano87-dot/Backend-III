import productRepository from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';
import { NotFoundError, ValidationError } from '../errors/index.js';
import { ERROR_MESSAGES } from '../errors/errorDictionary.js';

class ProductService {
  async getAllProducts() {
    const products = await productRepository.getAll();

    // Si no hay stock, marco el producto como OUT_OF_STOCK
    return products.map((product) => {
      const plain = product.toObject();
      if (plain.stock <= 0) {
        plain.status = PRODUCT_STATUS.OUT_OF_STOCK;
      }
      return plain;
    });
  }

  async getProductById(id) {
    const product = await productRepository.getById(id);
    if (!product) {
      throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  async createProduct(data) {
    if (!data.name || data.price === undefined) {
      throw new ValidationError(ERROR_MESSAGES.PRODUCT_NAME_PRICE_REQUIRED);
    }

    // Marco el estado según el stock
    data.status =
      data.stock && data.stock > 0
        ? PRODUCT_STATUS.AVAILABLE
        : PRODUCT_STATUS.OUT_OF_STOCK;

    return productRepository.create(data);
  }

  async updateProduct(id, data) {
    const updated = await productRepository.updateById(id, data);
    if (!updated) {
      throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await productRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return deleted;
  }
}

export default new ProductService();