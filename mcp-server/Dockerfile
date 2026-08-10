FROM node:22-alpine

WORKDIR /app/mcp-server
COPY mcp-server/package.json mcp-server/package-lock.json ./
RUN npm ci --omit=dev
COPY mcp-server/src ./src
COPY skills /app/skills

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/index.mjs"]
