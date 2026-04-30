FROM node:20

WORKDIR /app

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
