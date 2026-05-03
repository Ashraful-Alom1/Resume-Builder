# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the project's pom.xml and source code
COPY pom.xml .
COPY src ./src

# Install Maven and build the application
RUN apt-get update && apt-get install -y maven && \
    mvn clean package -DskipTests

# Run the jar file
ENTRYPOINT ["java", "-jar", "target/resume-builder-1.0.0.jar"]

# Expose the port the app runs on
EXPOSE 8080
