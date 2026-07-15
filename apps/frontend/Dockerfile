FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/frontend/package.json apps/frontend/
RUN npm ci

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY packages/shared packages/shared
COPY apps/frontend ./apps/frontend
RUN cd apps/frontend && npm run build

FROM nginx:alpine

COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
