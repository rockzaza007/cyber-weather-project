# Use an official Node runtime as the base image
FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the remaining application code to the working directory
COPY . .
COPY src src

# Build the React app
RUN yarn build

# Use NGINX to serve the built React app
FROM nginx:alpine

# Copy the built app from the build stage to the NGINX server
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]
