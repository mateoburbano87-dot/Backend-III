# Imagen oficial y liviana
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos dependencias primero (mejora el cache de Docker)
COPY package*.json ./

# Instalamos solo dependencias de producción
RUN npm ci --omit=dev

# Copiamos el resto del código
COPY . .

# Exponemos el puerto (debe coincidir con .env)
EXPOSE 3000

# Comando de arranque
CMD ["npm", "start"]