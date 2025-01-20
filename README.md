# Real-time Chat & Social Application

A full-stack real-time chat application built with Spring Boot, Apache Kafka, WebSocket, and Angular. Users can authenticate, create chat rooms, engage in real-time conversations, and share posts with other users.

## Features

- 🔐 User authentication and authorization
- 💬 Real-time chat functionality
- 🚪 Create and join chat rooms
- 📝 Social posting capabilities
- 🔄 Real-time updates using WebSocket
- 📨 Message queuing with Kafka
- 🗄️ Persistent storage with MySQL

## Prerequisites

Ensure you have the following installed:
- Java 17 or higher
- Node.js 16.x or higher
- npm 8.x or higher
- Apache Kafka 3.x
- MySQL 8.x
- IDE (recommended: IntelliJ IDEA for backend, VS Code for frontend)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
# Clone the repository
git@github.com:kafleprakash96/boot-angular-chat-web.git

# Navigate to project directory
cd boot-angular-chat-web
```

### 2. Backend Setup

1. Open the backend project in your IDE:
   ```bash
   cd chat-web-backend
   ```

2. Configure MySQL Database:
    - Create a new database in MySQL:
   ```sql
   CREATE DATABASE chat_app;
   ```

3. Update `application.properties`:
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/chat_app
   spring.datasource.username=your_username
   spring.datasource.password=your_password

   # Kafka Configuration
   spring.kafka.bootstrap-servers=localhost:9092
   spring.kafka.consumer.group-id=chat-group
   spring.kafka.consumer.auto-offset-reset=earliest

   # WebSocket Configuration
   websocket.endpoint=/ws
   websocket.topic.prefix=/topic

   # JWT Configuration
   jwt.secret=your_jwt_secret_key
   jwt.expiration=86400000
   ```

4. Start Kafka:

    
```bash

# Navigate to project directory
cd <kafka-directory>
```
    
   ```bash
   # Start Zookeeper
   ./bin/zookeeper-server-start.sh config/zookeeper.properties

   # In a new terminal, start Kafka
   ./bin/kafka-server-start.sh config/server.properties
   ```

For detailed instructions and troubleshooting, refer to the [Kafka Docs](https://github.com/kafleprakash96/kafka-docs).

5. Run the Spring Boot application:
    - Using IDE: Run the main application class `ChatWebBackendApplication.java`
    - Using Maven:
      ```bash
      mvn spring-boot:run
      ```

### 3. Frontend Setup

1. Open the frontend project in a separate IDE window:
   ```bash
   cd chat-web-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
// Skip step 3. Need refactor. 
3. Update the API configuration:
    - Navigate to `src/environments/environment.ts`
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     wsUrl: 'http://localhost:8080/ws'
   };
   ```

4. Run the Angular application:
   ```bash
   ng serve
   ```

## Using the Application

1. Access the application:
    - Open your browser and navigate to `http://localhost:4200`

2. Register a new account:
    - Click "Register" button
    - Fill in required information
    - Submit the registration form

3. Login:
    - Enter your credentials
    - Click "Login" button

4. Explore Features:
    - Create a new chat room
    - Join existing chat rooms
    - Start chatting with other users
    - Create and view posts
    - View your profile and chat history

## Common Issues & Troubleshooting

1. Kafka Connection Issues:
    - Ensure Zookeeper is running before starting Kafka
    - Verify Kafka server is running on port 9092
    - Check Kafka logs for any errors

2. Database Connection:
    - Verify MySQL service is running
    - Check database credentials in application.properties
    - Ensure database 'chat_app' exists

3. WebSocket Connection:
    - Check browser console for connection errors
    - Verify WebSocket endpoint configuration
    - Ensure CORS is properly configured

4. Frontend-Backend Connection:
    - Verify backend is running on port 8080
    - Check CORS configuration in Spring Boot
    - Verify API URLs in Angular environment files

## Architecture Overview

```
Backend (Spring Boot)
├── Security (JWT Authentication)
├── WebSocket
├── Kafka Message Broker
├── REST Controllers
├── Services
└── MySQL Database

Frontend (Angular)
├── Authentication Module
├── Chat Module
├── Post Module
├── WebSocket Service
└── HTTP Services
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
