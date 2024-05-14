FROM node:12-alpine
WORKDIR /alertas-futmondo
COPY . .
RUN npm install
CMD ["node", "src/bot.js"]