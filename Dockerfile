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

# Expose the port (Vite default is 5173)
EXPOSE 5173

# Start the app with host access enabled
CMD ["npm", "run", "dev", "--", "--host"]