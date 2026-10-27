FROM node:20-alpine AS build
WORKDIR /app
COPY node-ai/package*.json node-ai/tsconfig.json ./node-ai/
RUN cd node-ai && npm ci
COPY node-ai/src ./node-ai/src
RUN cd node-ai && npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node-ai/package*.json ./node-ai/
RUN cd node-ai && npm ci --omit=dev
COPY --from=build /app/node-ai/dist ./node-ai/dist
COPY data ./data
EXPOSE 3000
CMD ["node", "node-ai/dist/server.js"]
