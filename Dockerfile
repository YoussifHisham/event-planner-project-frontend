# Use lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the production app
RUN npm run build

# Install a simple static file server
RUN npm install -g serve

# Expose port 8080 (OpenShift standard)
EXPOSE 8080

# Serve the built files on port 8080
CMD ["serve", "-s", "dist", "-l", "8080"]