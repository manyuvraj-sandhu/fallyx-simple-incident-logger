# Use an official Node.js runtime
FROM node:18

# Set working directory
WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Run the server
CMD ["npx", "ts-node", "src/app.ts"]
