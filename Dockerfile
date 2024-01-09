FROM node:18.19.0-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install ci

COPY . .

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
