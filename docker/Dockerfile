FROM eclipse-temurin:21
RUN adduser spring
USER spring:spring
ARG JAR_FILE
COPY temp/jar/*.jar /app/app.jar
COPY temp/gui /var/react-logging/
EXPOSE 8090
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app/app.jar"]