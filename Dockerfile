FROM node:24-slim

# Set working directory within Docker
WORKDIR /src/

# Install dependencies within Docker
COPY package.json package-lock.json ./
RUN npm install

# Copy files into Docker
COPY . .

# Expose port 3000 and start app
EXPOSE 3000
CMD ["npm", "run", "dev"]
