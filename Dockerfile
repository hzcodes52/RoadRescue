# Multi-stage Dockerfile for Render (Repo Root)
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies
COPY RoadRescue-Java/backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source
COPY RoadRescue-Java/backend/src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

EXPOSE 8080

COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
