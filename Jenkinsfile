pipeline {

    agent any

    environment {
        // Successful Deploy to server after manually adding public key to authorized keys and accepting fingerprint once inside docker container jenkins"
        // Set environment variables here (if needed)
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        SERVER_SSH_CREDENTIALS = credentials('cloud-ssh-id')
        IMAGE_NAME = 'hanisntsolo/gg-webapp'
        SERVER_USER = 'hanisntsolo'
        SERVER_IP = '180.233.121.154'
        SERVER_DESTINATION_FOLDER = '/docker/lab/deployed'
	    SSH_KEY = credentials('cloud-ssh-id')
        APP_NAME = 'gg-webapp' // Replace with your Java app name
        DOCKER_IMAGE_TAG = 'latest' // You can use version numbers as well
        DOCKER_IMAGE_REPO = 'hanisntsolo/gg-webapp' // Replace with your Docker Hub repository name
        GITHUB_ACCESS_TOKEN = 'github-token'
    }

    stages {

          stage('DEBUG::Print npm Version') {
              steps {
                  script {
                      sh 'npm --version'
                  }
              }
          }

          stage('Build') {
              steps {
                  script {
                      sh 'echo "BUILD_STEP::Building Application $APP_NAME Using npm ..."'
                      sh 'npm install'
                      sh 'npm run build'
                  }
              }
          }
          stage('Build Docker Image') {
              steps {
                  script{
                      // Build the Docker image using the Dockerfile in your project directory
                      sh 'echo "DOCKER_BUILD_STEP::Building Application $APP_NAME Image Using Docker ..."'
                      sh "docker build -t $IMAGE_NAME ."
                  }
              }
          }
          stage('Publish to Docker Hub') {
              steps {
                  script {
                      // Authenticate with Docker Hub using the provided credentials
                      sh 'echo "DOCKER_PUBLISH_STEP::Pushing Docker $APP_NAME image to Docker Hub ..."'
                      docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                          // Push the Docker image to Docker Hub
                          sh "docker push $IMAGE_NAME"
                      }
                  }
              }
          }
          stage('Deploy to Server') {
              steps {
                  script {
                      sh 'echo "DEPLOY_TO_SINGH_SERVER::Deploying Docker $APP_NAME image to server ..."'
                      withCredentials([sshUserPrivateKey(credentialsId: 'cloud-ssh-id', keyFileVariable: 'SSH_KEY')]) {
                          sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker stop gg-webapp || true && docker rm gg-webapp|| true'"
                          sh """
                              if ! ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network inspect gangagetaways-network > /dev/null 2>&1'; then
                                  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network create gangagetaways-network'
                              fi
                          """
                          sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker run --restart always --network gangagetaways-network -d -p 13001:13001 --name gg-webapp $IMAGE_NAME'"
                      }
                  }
              }
          }
    }
}
