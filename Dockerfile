FROM node:24-slim
WORKDIR /src/

# Install dependencies inside the container.
# Copy package files first to use Docker caching.
COPY package.json package-lock.json ./
RUN npm install

# Copy the other files into the container.
COPY . .

# Start the Next.js development server.
# The website will be available at http://localhost:3000
CMD ["npm", "run", "dev"]
