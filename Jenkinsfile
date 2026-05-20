pipeline {
    agent any

    stages {

        stage('Install dependencies') {
            parallel {

                stage('Frontend dependencies') {
                    steps {
                        dir('frontend') {
                            bat 'npm install'
                        }
                    }
                }

                stage('Backend dependencies') {
                    steps {
                        dir('backend') {
                            bat 'npm install'
                        }
                    }
                }

            }
        }

        stage('Build frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Run backend tests') {
            steps {
                dir('backend') {
                    bat 'npm test'
                }
            }
        }

        stage('Build Docker images') {
            steps {
                bat 'docker build -t cloudshield-frontend ./frontend'
                bat 'docker build -t cloudshield-backend ./backend'
            }
        }

        stage('Deploy using Docker Compose') {
            steps {
                bat 'docker compose down'
                bat 'docker compose up -d --build'
            }
        }

        stage('Show running containers') {
            steps {
                bat 'docker ps'
            }
        }
    }

    post {

        success {
            echo 'CloudShield CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'CloudShield CI/CD pipeline failed. Check Jenkins logs.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}