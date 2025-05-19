
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 8080

# Start the app
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]
