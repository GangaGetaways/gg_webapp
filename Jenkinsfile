pipeline {

    agent any

    tools {
        nodejs 'node-js-installer'
    }

    parameters {
        string(name: 'DOCKER_IMAGE_TAG', defaultValue: 'latest', description: 'Specify the Docker image tag')
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
        // DOCKER_IMAGE_TAG = 'latest'
        DOCKER_IMAGE_TAG = "${env.BUILD_NUMBER}"
        DOCKER_IMAGE_REPO = 'hanisntsolo/gg-webapp'
        GITHUB_ACCESS_TOKEN = 'github-token'
        FEATURE_BRANCH = "feature/*"
        DEV_BRANCH = "dev"
    }

    stages {

        stage('Printenv') {
            steps {
                sh 'printenv'
            }
        }

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
                    sh "docker build -t $IMAGE_NAME:$DOCKER_IMAGE_TAG ."
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
                        echo "Starting deployment for branch: $env.GIT_BRANCH"
                        def branchName = env.GIT_BRANCH

                        // Derive Docker container name and network name from branch name
                        def containerName = "${APP_NAME}-${branchName.replaceAll('/', '-')}"
                        def networkName = "gangagetaways-network-${branchName.replaceAll('/', '-')}"

                        // Derive port number based on the branch
                        def portNumber = 13000 // default port for unknown branches

                        if (branchName ==~ /.*feature.*/) {
                            portNumber = 13000
                        } else if (branchName ==~ /.*dev.*/) {
                            portNumber = 13001
                        } else if (branchName ==~ /.*master.*/) {
                            portNumber = 13002
                        } else if (branchName ==~ /.*release.*/) {
                            portNumber = 13003
                        }

                        sh "echo 'DEBUG::Stopping and removing existing Docker container on server ...'"
                        sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker stop $containerName || true && docker rm $containerName || true'"
                        
                        // Create gangagetaways-network if not present already
                        sh """
                            if ! ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network inspect $networkName > /dev/null 2>&1'; then
                                ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network create $networkName'
                            fi
                        """

                        // Deploy Docker container to the specified network and port
                        sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker run --restart always --network $networkName -d -p $portNumber:13000 --name $containerName $DOCKER_IMAGE_REPO:$DOCKER_IMAGE_TAG'"
                    }
                }
            }
        }

        // stage('Deploy to Server') {
        //     steps {
        //         script {
        //             sh 'echo "DEPLOY_TO_SINGH_SERVER::Deploying Docker $APP_NAME image to server ..."'
        //             withCredentials([sshUserPrivateKey(credentialsId: 'cloud-ssh-id', keyFileVariable: 'SSH_KEY')]) {
        //                 echo "Starting deployment for branch: $env.GIT_BRANCH"
        //                 sh "echo 'DEBUG::Stopping and removing existing Docker container on server ...'"
        //                 if (env.GIT_BRANCH ==~ /.*feature.*/) {
        //                     def featureImageName = "${IMAGE_NAME}-feat"
        //                     sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker stop gg-webapp-feat || true && docker rm gg-webapp-feat || true'"
        //                     // Create gangagetaways-network if not present already feat
        //                     sh """
        //                         if ! ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network inspect gangagetaways-network-feat > /dev/null 2>&1'; then
        //                             ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network create gangagetaways-network-feat'
        //                         fi
        //                     """
        //                     // Deploy to feature-development environment for specific branches
        //                     sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker run --restart always --network gangagetaways-network-feat -d -p 13000:13000 --name gg-webapp-feat $IMAGE_NAME'"
        //                 } else if (env.GIT_BRANCH ==~ /.*dev.*/) {
        //                     // Deploy to development environment for specific branches
        //                     def devImageName = "${IMAGE_NAME}-dev"
        //                     sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker stop gg-webapp-dev || true && docker rm gg-webapp-dev || true'"
        //                     // Create gangagetaways-network if not present already dev
        //                     sh """
        //                         if ! ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network inspect gangagetaways-network-dev > /dev/null 2>&1'; then
        //                             ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network create gangagetaways-network-dev'
        //                         fi
        //                     """
        //                     sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker run --restart always --network gangagetaways-network-dev -d -p 13001:13001 --name gg-webapp-dev $IMAGE_NAME'"
        //                 } else if (env.GIT_BRANCH ==~ /.*master.*/) {
        //                     // Deploy to UAT environment for master branch
        //                     def uatImageName = "${IMAGE_NAME}-uat"
        //                     sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker stop gg-webapp-uat || true && docker rm gg-webapp-uat || true'"
        //                     // Create gangagetaways-network if not present already uat
        //                     sh """
        //                         if ! ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network inspect gangagetaways-network-uat > /dev/null 2>&1'; then
        //                             ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network create gangagetaways-network-uat'
        //                         fi
        //                     """
        //                     sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker run --restart always --network gangagetaways-network-uat -d -p 13002:13002 --name gg-webapp-uat $IMAGE_NAME'"
        //                 } else if (env.GIT_BRANCH ==~ /.*release.*/) {
        //                     // Deploy to Prod environment for release branch
        //                     def prodImageName = "${IMAGE_NAME}-prod"
        //                     sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker stop gg-webapp-prod || true && docker rm gg-webapp-prod || true'"
        //                     // Create gangagetaways-network if not present already prod
        //                     sh """
        //                         if ! ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network inspect gangagetaways-network-prod > /dev/null 2>&1'; then
        //                             ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network create gangagetaways-network-prod'
        //                         fi
        //                     """
        //                     sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker run --restart always --network gangagetaways-network-prod -d -p 13003:13003 --name gg-webapp-prod $IMAGE_NAME'"
        //                 } else {
        //                     echo "Skipping deployment for branch: $env.GIT_BRANCH"
        //                 }
        //             }
        //         }
        //     }
        // }
    }
}
