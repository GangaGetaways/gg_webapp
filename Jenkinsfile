pipeline {
    agent any
    tools {
        nodejs 'node-js-installer'
    }
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        SERVER_SSH_CREDENTIALS = credentials('cloud-ssh-id')
        IMAGE_NAME = 'hanisntsolo/gg-webapp'
        SERVER_USER = 'hanisntsolo'
        SERVER_IP = '180.233.121.154'
        SERVER_DESTINATION_FOLDER = '/docker/lab/deployed'
        SSH_KEY = credentials('cloud-ssh-id')
        APP_NAME = 'gg-webapp'
        DOCKER_IMAGE_TAG = 'latest'
        DOCKER_IMAGE_REPO = 'hanisntsolo/gg-webapp'
        GITHUB_ACCESS_TOKEN = 'github-token'
        FEATURE_BRANCH = "feature/*"
        DEV_BRANCH = "dev"
    }

    stages {
        stage('DEBUG::Print npm Version') {
            steps {
                script {
                    sh 'npm config ls'
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
                script {
                    sh 'echo "DOCKER_BUILD_STEP::Building Application $APP_NAME Image Using Docker ..."'
                    sh "docker build -t $IMAGE_NAME ."
                }
            }
        }

        stage('Publish to Docker Hub') {
            steps {
                script {
                    sh 'echo "DOCKER_PUBLISH_STEP::Pushing Docker $APP_NAME image to Docker Hub ..."'
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
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
                        // Create gangagetaways-network if not present already
                        sh """
                            if ! ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network inspect gangagetaways-network > /dev/null 2>&1'; then
                                ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network create gangagetaways-network'
                            fi
                        """
                        if (env.BRANCH_NAME == FEATURE_BRANCH) {
                            // Deploy to feature-development environment for specific branches
                            sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker stop gg-webapp-feat || true && docker rm gg-webapp-dev || true'"
                            sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker run --restart always --network gangagetaways-network -d -p 13000:13000 --name gg-webapp-feat $IMAGE_NAME'"
                        } else if (env.BRANCH_NAME == DEV_BRANCH) {
                            // Deploy to development environment for specific branches
                            sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker stop gg-webapp-dev || true && docker rm gg-webapp-dev || true'"
                            sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker run --restart always --network gangagetaways-network -d -p 13001:13001 --name gg-webapp-dev $IMAGE_NAME'"
                        } else if (env.BRANCH_NAME == 'master') {
                            // Deploy to UAT environment for master branch
                            sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker stop gg-webapp-uat || true && docker rm gg-webapp-uat || true'"
                            sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker run --restart always --network gangagetaways-network -d -p 13002:13002 --name gg-webapp-uat $IMAGE_NAME'"
                        } else if (env.BRANCH_NAME == 'release') {
                            // Deploy to Prod environment for release branch
                            sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker stop gg-webapp-prod || true && docker rm gg-webapp-prod || true'"
                            sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker run --restart always --network gangagetaways-network -d -p 13003:13003 --name gg-webapp-prod $IMAGE_NAME'"
                        } else {
                            echo "Skipping deployment for branch: $env.BRANCH_NAME"
                        }
                    }
                }
            }
        }
    }
}
