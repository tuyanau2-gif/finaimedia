FROM node:20-alpine
WORKDIR /app
COPY package.json server.mjs ./
COPY dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.mjs"]
