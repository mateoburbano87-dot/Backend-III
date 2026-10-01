import {
  USER_ROLES,
  ORDER_STATUS,
  ORDER_PRIORITY,
  DELIVERY_STATUS,
} from '../constants/index.js';

// Listas chiquitas para generar datos con algo de variedad
const NOMBRES = ['Ana', 'Luis', 'María', 'Carlos', 'Sofía', 'Diego', 'Lucía', 'Pedro'];
const APELLIDOS = ['Pérez', 'Gómez', 'Fernández', 'Rodríguez', 'López', 'Martínez'];

// Devuelvo un elemento random de un array
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Genero un número random entre min y max (inclusive)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateMockUser = (role = USER_ROLES.CLIENTE) => {
  const nombre = pickRandom(NOMBRES);
  const apellido = pickRandom(APELLIDOS);
  // Uso Date.now() + random para que los emails no choquen entre sí
  const suffix = `${Date.now()}${randomInt(100, 999)}`;

  return {
    name: `${nombre} ${apellido}`,
    email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}.${suffix}@test.com`,
    role,
  };
};

export const generateMockOrder = (userId) => {
  return {
    user: userId,
    products: [],
    status: pickRandom(Object.values(ORDER_STATUS)),
    priority: pickRandom(Object.values(ORDER_PRIORITY)),
  };
};

export const generateMockDelivery = (orderId, repartidorId = null) => {
  return {
    order: orderId,
    repartidor: repartidorId,
    // Si no hay repartidor, la entrega queda como ASSIGNED
    status: repartidorId ? pickRandom(Object.values(DELIVERY_STATUS)) : DELIVERY_STATUS.ASSIGNED,
  };
};