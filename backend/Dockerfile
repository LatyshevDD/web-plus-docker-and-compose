FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist/
RUN npm install pm2 -g
COPY --from=builder /app/ecosystem.config.js ./


CMD ["pm2-runtime", "ecosystem.config.js"]
