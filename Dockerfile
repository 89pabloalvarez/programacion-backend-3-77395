FROM node:20-alpine AS deps

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

EXPOSE 8080

CMD ["npm", "start"]