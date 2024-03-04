# Use official Node.js image as the base image
FROM node:16.20.2

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run mainnet:build

# Expose the port Next.js is running on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
