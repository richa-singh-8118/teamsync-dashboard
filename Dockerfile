FROM node:20-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy configuration files
COPY package.json ./

# Copy backend and frontend
COPY backend ./backend
COPY frontend ./frontend

# Install dependencies and build
RUN npm run install-all
RUN cd frontend && npm run build

# Expose port (Railway will provide the PORT env var)
EXPOSE 5000

# Start the application using our root script
CMD ["npm", "start"]
