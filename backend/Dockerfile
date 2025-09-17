FROM node:20-alpine

WORKDIR /app

# Create uploads directory
RUN mkdir -p uploads && chmod 777 uploads

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]