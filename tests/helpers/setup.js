import mongoose from 'mongoose';
import env from '../../src/config/env.config.js';

// Conecto a la base de test antes de correr la suite
export const connectDB = async () => {
  await mongoose.connect(env.mongoUri);
};

export const disconnectDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};

// Limpia todas las colecciones entre tests para que sean repetibles
export const cleanDB = async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
};