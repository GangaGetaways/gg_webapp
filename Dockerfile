FROM jenkins/jenkins:latest

USER root

# Install Docker CLI inside the Jenkins container
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
RUN echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update && apt-get install -y docker-ce-cli
# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Add a script to read the environment name and map the corresponding .env file
COPY set-env.sh .
RUN chmod +x set-env.sh
# Default arg type
ARG ENV_TYPE=dev
# Run the script to set up dynamic environment variables
RUN ./set-env.sh

# Expose the application port (assuming your Node.js app runs on port 3000)
EXPOSE 12999

# Command to start the application with dynamic environment variables
CMD ["npm", "start", "--", "cross-env", "ENV_TYPE=${ENV_TYPE}", "next", "dev", "-p", "12999"]