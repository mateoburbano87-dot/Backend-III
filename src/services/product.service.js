import productRepository from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';

class ProductService {
  async getAllProducts() {
    const products = await productRepository.getAll();

    // Acá va lógica: si no hay stock, marco el producto como OUT_OF_STOCK
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
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  async createProduct(data) {
    if (!data.name || data.price === undefined) {
      throw new Error('Nombre y precio son obligatorios');
    }

    // Si viene sin stock, lo marco como OUT_OF_STOCK desde el arranque
    if (data.stock === 0 || data.stock === undefined) {
      data.status = PRODUCT_STATUS.OUT_OF_STOCK;
    } else {
      data.status = PRODUCT_STATUS.AVAILABLE;
    }

    return productRepository.create(data);
  }

  async updateProduct(id, data) {
    const updated = await productRepository.updateById(id, data);
    if (!updated) {
      throw new Error('Producto no encontrado');
    }
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await productRepository.deleteById(id);
    if (!deleted) {
      throw new Error('Producto no encontrado');
    }
    return deleted;
  }
}

export default new ProductService();