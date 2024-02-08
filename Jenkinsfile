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
        DOCKER_IMAGE_TAG = "${env.BUILD_NUMBER}"
        DOCKER_IMAGE_REPO = 'hanisntsolo/gg-webapp'
        GITHUB_ACCESS_TOKEN = 'github-token'
        FEATURE_BRANCH = "feature/*"
        DEV_BRANCH = "dev"
        APP_ENV = "dev"
    }

    stages {

        stage('Printenv') {
            steps {
                sh 'printenv'
                // Variable definition
                // Testing area
                script {
                    def awkCommand = '''\
                            awk '{print $1}'
                        '''
                    //Set env based on branch //
                    def branchName = env.GIT_BRANCH
                    // Derive env based on branch
                    def appEnv = "local" // default port for unknown branches

                    if (branchName ==~ /.*feature.*/) {
                        appEnv = "dev"
                    } else if (branchName ==~ /.*dev.*/) {
                        appEnv = "uat"
                    } else if (branchName ==~ /.*master.*/) {
                        appEnv = "uat"
                    } else if (branchName ==~ /.*release.*/) {
                        appEnv = "prod"
                    }
                    echo "app env :: $appEnv"
                // Statement to explicitly handle container removal via port
                echo "Removing old container via port selector in case of new feature branches: 13000"
                sh """
                    ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP "docker rm -f \$(docker ps | grep 13000 | $awkCommand)" || true
                """
                }
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

        stage('Build Docker Image and Set Env') {
            steps {
                script {
                     //Set env based on branch //
                    def branchName = env.GIT_BRANCH
                    // Derive env based on branch
                    def appEnv = "dev" // default env for unknown branches
                    if (branchName ==~ /.*feature.*/) {
                        appEnv = "dev"
                    } else if (branchName ==~ /.*dev.*/) {
                        appEnv = "uat"
                    } else if (branchName ==~ /.*master.*/) {
                        appEnv = "uat"
                    } else if (branchName ==~ /.*release.*/) {
                        appEnv = "prod"
                    }
                    sh 'echo "DOCKER_BUILD_STEP::Building Application $APP_NAME Image Using Docker ..."'
                    sh "docker build --build-arg ENV_TYPE=$appEnv -t $IMAGE_NAME:$DOCKER_IMAGE_TAG ."
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
                        def awkCommand = '''\
                            awk '{print $1}'
                            '''
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
                        // Statement to explicity handle container removal via port ::
                        echo "Removing old container via port selector in case of new feature branches : $portNumber"
                        sh """
                            ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP "docker rm -f \$(docker ps | grep $portNumber | $awkCommand)" || true
                        """
                        // Stop and Remove old container
                        echo "Removing old container : $containerName"
                        sh "echo 'DEBUG::Stopping and removing existing Docker container on server ...'"
                        sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker stop $containerName || true && docker rm $containerName || true'"
                        // Remove old Docker networks
                        echo "Removing old network : $networkName"
                        sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network rm $networkName || true'"
                        
                        
                        // Create gangagetaways-network if not present already
                        sh """
                            if ! ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network inspect $networkName > /dev/null 2>&1'; then
                                ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker network create $networkName'
                            fi
                        """

                        // Deploy Docker container to the specified network and port
                        sh "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker run --restart always --network $networkName -d -p $portNumber:12999 --name $containerName $DOCKER_IMAGE_REPO:$DOCKER_IMAGE_TAG'"
                    }
                }
            }
        }
    }
}
