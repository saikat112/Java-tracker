# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/expense-tracker-1.0.0.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-Dserver.port=10000", "-jar", "app.jar"]
