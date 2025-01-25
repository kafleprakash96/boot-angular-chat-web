# Base image
FROM eclipse-temurin:17-jdk as build

# Set working directory inside the container
WORKDIR /app

# Copy Maven wrapper and project files
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./
COPY src ./src
# Build the application
RUN ./mvnw clean package -DskipTests

# Final runtime image
FROM eclipse-temurin:17-jdk

# Set working directory for the application
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
