# Use a lightweight Java 17 runtime
FROM eclipse-temurin:17-jre-jammy

# Create app directory inside container
WORKDIR /app

# Copy the built jar from host into container
COPY target/devops-app-1.0.0.jar app.jar

# Expose Spring Boot default port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
