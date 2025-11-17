# ============================================
# 1. Build da aplicação
# ============================================
FROM node:20-alpine AS build-env
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# ============================================
# 2. Servir com NGINX
# ============================================
FROM nginx:alpine

# Remove config default
RUN rm /etc/nginx/conf.d/default.conf

# Copia sua config correta
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build gerado pelo Vite / React Router
COPY --from=build-env /app/build/client /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
