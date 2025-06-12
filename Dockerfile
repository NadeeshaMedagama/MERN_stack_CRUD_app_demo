# Build stage
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve static build using Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Optional: Replace default Nginx config
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
