import { ProductModel } from '../models/product.model.js';

// Acá es el único lugar donde se toca Mongoose
class ProductRepository {
  async getAll() {
    // Filtro por defecto: no traigo productos borrados (por si agrego soft delete después)
    return ProductModel.find({ deleted: { $ne: true } });
  }

  async getById(id) {
    return ProductModel.findById(id);
  }

  async create(data) {
    return ProductModel.create(data);
  }

  async updateById(id, data) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return ProductModel.findByIdAndDelete(id);
  }
}

export default new ProductRepository();