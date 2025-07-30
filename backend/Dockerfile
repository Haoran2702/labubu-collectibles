FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npx tsc

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"] 