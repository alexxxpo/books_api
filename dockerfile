FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npx prisma generate
RUN npx prisma db push
RUN npm run build
CMD ["npm", "run", "start"]
