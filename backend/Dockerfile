FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat wget

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY server.js ./

RUN addgroup --system --gid 1001 api && adduser --system --uid 1001 --ingroup api api
RUN chown -R api:api /app
USER api

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server.js"]
