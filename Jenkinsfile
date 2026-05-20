pipeline {
  agent any

  environment {
    FRONTEND_IMAGE = "cloudshield-frontend:${BUILD_NUMBER}"
    BACKEND_IMAGE = "cloudshield-backend:${BUILD_NUMBER}"
  }

  stages {
    stage('Install dependencies') {
      parallel {
        stage('Frontend dependencies') {
          steps {
            dir('frontend') {
              sh 'npm install'
            }
          }
        }
        stage('Backend dependencies') {
          steps {
            dir('backend') {
              sh 'npm install'
            }
          }
        }
      }
    }

    stage('Build frontend') {
      steps {
        dir('frontend') {
          sh 'npm run build'
        }
      }
    }

    stage('Run backend tests') {
      steps {
        dir('backend') {
          sh 'npm test'
        }
      }
    }

    stage('Build Docker images') {
      steps {
        sh 'docker build -t $FRONTEND_IMAGE ./frontend'
        sh 'docker build -t $BACKEND_IMAGE ./backend'
      }
    }

    stage('Deploy using Docker Compose') {
      steps {
        sh 'docker compose down'
        sh 'docker compose up -d --build'
      }
    }
  }

  post {
    success {
      echo 'CloudShield CI/CD pipeline completed successfully.'
    }
    failure {
      echo 'CloudShield CI/CD pipeline failed. Check Jenkins stage logs.'
    }
  }
}
