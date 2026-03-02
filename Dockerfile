FROM node:20-alpine

WORKDIR /app

# Copy package management files first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for Vite)
RUN npm install

# Copy all source files
COPY . .

# Expose the Vite default port
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]
