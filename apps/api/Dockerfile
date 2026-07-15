FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN npm ci

COPY packages/shared packages/shared
COPY apps/api/prisma apps/api/prisma/
RUN cd apps/api && npx prisma generate

COPY apps/api ./apps/api
RUN cd apps/api && npm run build

FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN npm ci --omit=dev

COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/apps/api/node_modules/.prisma ./apps/api/node_modules/.prisma
COPY --from=build /app/apps/api/node_modules/@prisma ./apps/api/node_modules/@prisma
COPY apps/api/prisma apps/api/prisma/

EXPOSE 3000

CMD ["sh", "-c", "cd apps/api && node dist/src/main"]
