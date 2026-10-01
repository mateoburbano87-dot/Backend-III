// Uso Object.freeze para que no se puedan modificar en runtime

export const USER_ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  // Agrego REPARTIDOR para el módulo de pedidos/entregas
  REPARTIDOR: 'REPARTIDOR',
  CLIENTE: 'CLIENTE',
});

export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
});

// Nuevas constantes para el módulo de pedidos
export const ORDER_STATUS = Object.freeze({
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
});

export const ORDER_PRIORITY = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
});

export const DELIVERY_STATUS = Object.freeze({
  ASSIGNED: 'ASSIGNED',
  ON_THE_WAY: 'ON_THE_WAY',
  DELIVERED: 'DELIVERED',
});