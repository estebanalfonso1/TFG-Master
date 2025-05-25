# Uso de imagen de OpenJDK con JDK (es necesario compilar el código)
FROM eclipse-temurin:17-jdk AS builder

# Establecimiento del directorio de trabajo en el contenedor
WORKDIR /app

# Copia de todos los archivos del directorio actual
COPY . .

# Asignar permisos de ejecución al wrapper de Maven
RUN chmod +x ./mvnw

# Ejecución de Maven para construir el archivo JAR sin ejecutar los tests
RUN ./mvnw clean package -DskipTests

# Uso de la imagen de OpenJDK pero solo JRE para el entorno de ejecución
FROM eclipse-temurin:17-jre

# Establecimiento del directorio de trabajo en el contenedor
WORKDIR /app

# Copia del archivo JAR generado desde la imagen del build
COPY --from=builder /app/target/*.jar app.jar

# Exposición del puerto en el que la aplicación se ejecutará
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]
