FROM node:20-alpine

WORKDIR /usr/src/app

# Se copian primero los manifiestos para aprovechar la cache de capas de Docker: si no cambian package.json/package-lock.json, no se reinstalan dependencias en cada build.
COPY package*.json ./

RUN npm install

# Recién acá se copia el resto del código (lo que sí cambia seguido)..
COPY . .

# Puerto en el que escucha la API (ver CONSTANTS.PORT / variable PORT).
EXPOSE 8080

# Variables de entorno reales (Mongo, NODE_ENV, etc.) se pasan al correr el contenedor (--env-file .env o -e VAR=valor), nunca se hardcodean acá.
CMD ["npm", "start"]