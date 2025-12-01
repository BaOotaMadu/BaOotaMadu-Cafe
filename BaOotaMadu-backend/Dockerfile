# Use an official Node.js runtime
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all backend source code
COPY . .

# Expose the port your backend runs on (from your index.js)
EXPOSE 3001

# Define the command to run your app (using index.js)
CMD [ "node", "index.js" ]