FROM node:16-alpine


RUN mkdir -p /home/node/instapet/node_modules && chown -R node:node /home/node/instapet && chown -R node:node /root
WORKDIR /home/node/instapet
COPY package*.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
CMD ["node", "src/index.js"]