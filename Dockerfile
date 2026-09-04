# Estágio 1: build do frontend com Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Estágio 2: servidor nginx + API Node
FROM node:20-alpine
RUN apk add --no-cache nginx
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY nginx-main.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY server.js ./server.js
EXPOSE 80
EXPOSE 3000
CMD ["sh", "-c", "node server.js & exec nginx -g 'daemon off;'"]
