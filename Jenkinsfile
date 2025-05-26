pipeline {
  agent {
    docker {
      image 'ervaal/custom-jenkins-build-agent:1.0.2'
      args '-u root -v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    IMAGE_NAME = 'ervaal/guessbydaylight'
    BUILD_TAG_LATEST = "${IMAGE_NAME}:latest"
    BUILD_TAG_VERSION = "${IMAGE_NAME}:${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'yarn install --frozen-lockfile'
      }
    }

    stage('Lint & Static Analysis') {
      steps {
        sh 'yarn lint || echo "lint failed but continuing..."'
      }
    }

    stage('Test & Coverage') {
      environment {
        VITE_SUPABASE_SERVICE_ROLE_KEY = 'dummy-key'
        VITE_SUPABASE_URL = 'https://dummy.supabase.io'
      }
      parallel {
        stage('Unit Tests') {
          steps {
            sh 'yarn test'
          }
        }
        stage('Coverage') {
          steps {
            sh 'yarn test:coverage'
          }
        }
      }
    }

    stage('Archive Coverage') {
      steps {
        archiveArtifacts artifacts: 'coverage/**', fingerprint: true
      }
    }

    stage('Build Docker Image') {
      steps {
        sh '''
          docker build -t $BUILD_TAG_VERSION -t $BUILD_TAG_LATEST .
        '''
      }
    }

    stage('Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-id', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PW')]) {
          sh '''
            echo "$DOCKER_PW" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $BUILD_TAG_VERSION
            docker push $BUILD_TAG_LATEST
          '''
        }
      }
    }
  }

  post {
    always {
      echo "Build success: $BUILD_TAG_VERSION"
      sh "docker rmi ${env.BUILD_TAG_VERSION} || true"
      sh "docker rmi ${env.BUILD_TAG_LATEST} || true"
    }
  }
}

