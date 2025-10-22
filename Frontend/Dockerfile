# 1. Builder Stage: Build the Vite app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install all dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source code and build
COPY . .
RUN npm run build

# 2. Runner Stage: Serve with 'serve'
FROM node:20-alpine
WORKDIR /app

# Install 'serve', a simple static server
RUN npm install -g serve

# Copy *only* the built files from the builder
# Vite builds to a 'dist' folder
COPY --from=builder /app/dist .

# Expose the default port for 'serve'
EXPOSE 3000

# -s flag is for Single Page App (handles routing)
# -l tells it to listen on all network interfaces
CMD ["serve", "-s", ".", "-l", "tcp://0.0.0.0:3000"]