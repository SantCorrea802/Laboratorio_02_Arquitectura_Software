FROM openjdk:21-ea-11-jdk-slim
EXPOSE 8080
ADD target/bank.jar bank.jar
ENTRYPOINT ["java","-jar","/bank.jar"]