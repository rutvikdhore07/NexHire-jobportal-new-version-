FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw clean package -DskipTests 2>/dev/null || \
    (apk add --no-cache maven && mvn clean package -DskipTests)

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S nexhire && adduser -S nexhire -G nexhire
COPY --from=builder /app/target/*.jar app.jar
RUN chown nexhire:nexhire app.jar
USER nexhire
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
