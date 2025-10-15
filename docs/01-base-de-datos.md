# Base de Datos

## ¿Qué es una Base de Datos?

Una **Base de Datos** es un sistema organizado de almacenamiento de información que permite guardar, consultar, actualizar y eliminar datos de manera eficiente y estructurada.

## Base de Datos en nuestro proyecto

En el proyecto **AppClienteCorreo**, utilizamos **MySQL** como sistema gestor de base de datos relacional.

### Configuración en el código

La configuración de la base de datos se encuentra en el archivo `application.properties`:

```properties
# Configuración de la Base de Datos
spring.datasource.url=jdbc:mysql://localhost:3306/clientecorreo
spring.datasource.username=ejemplo
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuración de JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Explicación de los parámetros:

- **`spring.datasource.url`**: Define la ubicación de la base de datos
  - `jdbc:mysql://` - Protocolo de conexión JDBC para MySQL
  - `localhost:3306` - Servidor y puerto donde corre MySQL
  - `clientecorreo` - **Nombre de nuestra base de datos**

- **`spring.datasource.username`**: Usuario de MySQL (root)

- **`spring.datasource.password`**: Contraseña del usuario

- **`spring.jpa.hibernate.ddl-auto=update`**: 
  - Hibernate crea o actualiza automáticamente las tablas según las entidades Java
  - Opciones: `create`, `update`, `create-drop`, `validate`

- **`spring.jpa.show-sql=true`**: Muestra en consola las consultas SQL ejecutadas

## Estructura de nuestra Base de Datos

Nuestra base de datos **clientecorreo** contiene dos tablas principales:

1. **cliente** - Almacena información de los clientes
2. **correo** - Almacena los correos electrónicos asociados a cada cliente

## Ventajas de usar una Base de Datos

✅ **Persistencia**: Los datos se mantienen aunque la aplicación se cierre  
✅ **Organización**: Estructura clara y ordenada de la información  
✅ **Integridad**: Garantiza que los datos sean consistentes y válidos  
✅ **Concurrencia**: Múltiples usuarios pueden acceder simultáneamente  
✅ **Seguridad**: Control de acceso mediante usuarios y permisos  
✅ **Consultas eficientes**: Búsqueda rápida de información mediante SQL  

## Diagrama de la Base de Datos

```
┌─────────────────────────┐
│   Base de Datos:        │
│   clientecorreo         │
├─────────────────────────┤
│                         │
│  ┌─────────────────┐    │
│  │  Tabla: cliente │    │
│  └─────────────────┘    │
│           │             │
│           │ Relación    │
│           │ 1:N         │
│           ▼             │
│  ┌─────────────────┐    │
│  │  Tabla: correo  │    │
│  └─────────────────┘    │
│                         │
└─────────────────────────┘
```

## Creación de la Base de Datos

Para crear la base de datos manualmente en MySQL:

```sql
CREATE DATABASE IF NOT EXISTS clientecorreo;
USE clientecorreo;
```

Sin embargo, en nuestro proyecto, **Hibernate** se encarga automáticamente de crear las tablas cuando ejecutamos la aplicación por primera vez, gracias a la configuración `spring.jpa.hibernate.ddl-auto=update`.
