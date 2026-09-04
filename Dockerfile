FROM node:24-slim
WORKDIR /app/

# Install dependencies first to use Docker caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy remaining files into the container
COPY . .

# Start development server
CMD ["npm", "run", "dev"]
