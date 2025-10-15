# Usuarios de Base de Datos

## ¿Qué es un Usuario de Base de Datos?

Un **Usuario** es una cuenta con permisos específicos para acceder y manipular una base de datos. Los usuarios garantizan la seguridad y el control de acceso a los datos.

---

## Usuarios en nuestro proyecto

### Configuración en application.properties

**Archivo:** `src/main/resources/application.properties` (líneas 8-10)

```properties
# Usuario de la base de datos
spring.datasource.username=root
spring.datasource.password=1597845
```

### Explicación:

- **`spring.datasource.username=root`**: Usuario con el que la aplicación se conecta a MySQL
- **`spring.datasource.password=1597845`**: Contraseña del usuario

---

## Tipos de Usuarios en MySQL

### 1. Usuario ROOT

```properties
spring.datasource.username=root
```

**Características:**
- ✅ Acceso completo a todas las bases de datos
- ✅ Puede crear, modificar y eliminar bases de datos
- ✅ Puede crear y gestionar otros usuarios
- ⚠️ **Riesgo**: Usar root en producción es peligroso
- 📌 **Uso recomendado**: Solo para desarrollo local

### 2. Usuario de Desarrollo (comentado en el código)

```properties
#spring.datasource.username=usuarioDesarrollo
#spring.datasource.password=12345678
```

**Características:**
- ✅ Permisos limitados a una base de datos específica
- ✅ Más seguro que usar root
- ✅ Ideal para entornos de desarrollo
- 📌 **Uso recomendado**: Desarrollo y pruebas

### 3. Usuario de Producción (comentado en el código)

```properties
#spring.datasource.username=usuarioProduccion
```

**Características:**
- ✅ Permisos mínimos necesarios
- ✅ Solo acceso a la base de datos de producción
- ✅ Sin permisos para crear/eliminar bases de datos
- 📌 **Uso recomendado**: Aplicaciones en producción

---

## Crear Usuarios en MySQL

### Crear usuario de desarrollo:

```sql
-- Crear el usuario
CREATE USER 'usuarioDesarrollo'@'localhost' IDENTIFIED BY '12345678';

-- Otorgar permisos sobre la base de datos clientecorreo
GRANT ALL PRIVILEGES ON clientecorreo.* TO 'usuarioDesarrollo'@'localhost';

-- Aplicar los cambios
FLUSH PRIVILEGES;
```

### Crear usuario de producción (con permisos limitados):

```sql
-- Crear el usuario
CREATE USER 'usuarioProduccion'@'localhost' IDENTIFIED BY 'contraseñaSegura123!';

-- Otorgar solo permisos necesarios (SELECT, INSERT, UPDATE, DELETE)
GRANT SELECT, INSERT, UPDATE, DELETE ON clientecorreo.* 
TO 'usuarioProduccion'@'localhost';

-- NO otorgar permisos de DROP, CREATE, ALTER
FLUSH PRIVILEGES;
```

---

## Permisos de Usuarios

### Tipos de permisos en MySQL:

| Permiso      | Descripción                                    | Desarrollo | Producción |
|--------------|------------------------------------------------|------------|------------|
| SELECT       | Leer datos (consultas)                         | ✅         | ✅         |
| INSERT       | Insertar nuevos registros                      | ✅         | ✅         |
| UPDATE       | Modificar registros existentes                 | ✅         | ✅         |
| DELETE       | Eliminar registros                             | ✅         | ✅         |
| CREATE       | Crear tablas y bases de datos                  | ✅         | ❌         |
| DROP         | Eliminar tablas y bases de datos               | ✅         | ❌         |
| ALTER        | Modificar estructura de tablas                 | ✅         | ❌         |
| INDEX        | Crear y eliminar índices                       | ✅         | ❌         |
| ALL          | Todos los permisos                             | ✅         | ❌         |

---

## Verificar Usuarios y Permisos

### Ver todos los usuarios:

```sql
SELECT User, Host FROM mysql.user;
```

**Resultado:**
```
+---------------------+-----------+
| User                | Host      |
+---------------------+-----------+
| root                | localhost |
| usuarioDesarrollo   | localhost |
| usuarioProduccion   | localhost |
+---------------------+-----------+
```

### Ver permisos de un usuario:

```sql
SHOW GRANTS FOR 'usuarioDesarrollo'@'localhost';
```

**Resultado:**
```
+-------------------------------------------------------------------------+
| Grants for usuarioDesarrollo@localhost                                  |
+-------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `usuarioDesarrollo`@`localhost`                   |
| GRANT ALL PRIVILEGES ON `clientecorreo`.* TO `usuarioDesarrollo`@`localhost` |
+-------------------------------------------------------------------------+
```

---

## Seguridad de Usuarios

### ⚠️ Malas prácticas:

```properties
# ❌ NO hacer esto en producción
spring.datasource.username=root
spring.datasource.password=12345678
```

### ✅ Buenas prácticas:

```properties
# ✅ Usuario específico con permisos limitados
spring.datasource.username=usuarioProduccion
spring.datasource.password=${DB_PASSWORD}  # Variable de entorno
```

---

## Variables de Entorno para Seguridad

### En lugar de hardcodear las credenciales:

```properties
# application.properties
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:1597845}
```

### Configurar variables de entorno en Windows:

```cmd
set DB_USERNAME=usuarioProduccion
set DB_PASSWORD=contraseñaSegura123!
```

### Configurar variables de entorno en Linux/Mac:

```bash
export DB_USERNAME=usuarioProduccion
export DB_PASSWORD=contraseñaSegura123!
```

---

## Conexión a la Base de Datos

### Flujo de conexión:

```
┌─────────────────────────────────────────┐
│  Aplicación Spring Boot                  │
│  (AppClienteCorreoApplication.java)     │
└──────────────┬──────────────────────────┘
               │
               │ Lee configuración
               ▼
┌─────────────────────────────────────────┐
│  application.properties                  │
│  - spring.datasource.url                 │
│  - spring.datasource.username            │
│  - spring.datasource.password            │
└──────────────┬──────────────────────────┘
               │
               │ Intenta conectar
               ▼
┌─────────────────────────────────────────┐
│  MySQL Server (localhost:3306)           │
│  - Valida usuario y contraseña          │
│  - Verifica permisos                     │
└──────────────┬──────────────────────────┘
               │
               │ Conexión exitosa
               ▼
┌─────────────────────────────────────────┐
│  Base de Datos: clientecorreo            │
│  - Acceso a tablas según permisos       │
└─────────────────────────────────────────┘
```

---

## Errores Comunes con Usuarios

### Error 1: Access Denied

```
Access denied for user 'usuarioDesarrollo'@'localhost' (using password: YES)
```

**Causas:**
- Usuario no existe
- Contraseña incorrecta
- Usuario no tiene permisos

**Solución:**
```sql
-- Verificar si el usuario existe
SELECT User FROM mysql.user WHERE User = 'usuarioDesarrollo';

-- Recrear el usuario si es necesario
DROP USER IF EXISTS 'usuarioDesarrollo'@'localhost';
CREATE USER 'usuarioDesarrollo'@'localhost' IDENTIFIED BY '12345678';
GRANT ALL PRIVILEGES ON clientecorreo.* TO 'usuarioDesarrollo'@'localhost';
FLUSH PRIVILEGES;
```

### Error 2: Unknown database

```
Unknown database 'clientecorreo'
```

**Solución:**
```sql
CREATE DATABASE IF NOT EXISTS clientecorreo;
```

---

## Usuario de Desarrollo en el Código

### Variable de entorno para identificar el ambiente:

```properties
# application.properties
app.usuario.desarrollo=desarrollo
```

### Uso en GlobalExceptionHandler

**Archivo:** `src/main/java/app/controladores/GlobalExceptionHandler.java` (líneas 78-96)

```java
@Autowired
private Environment miVariableEntorno;

private String pilaErrores() {
    String VariableEntorno = miVariableEntorno.getProperty("app.usuario.desarrollo");
    
    if (VariableEntorno != null && VariableEntorno.equals("desarrollo")) {
        // Mostrar información detallada de errores
        return stackTraceCompleto();
    }
    
    // En producción, no mostrar detalles sensibles
    return "Error interno del servidor";
}
```

**Propósito:** Mostrar información detallada de errores solo en desarrollo, no en producción.

---

## Gestión de Usuarios - Comandos Útiles

### Cambiar contraseña de un usuario:

```sql
ALTER USER 'usuarioDesarrollo'@'localhost' IDENTIFIED BY 'nuevaContraseña';
```

### Revocar permisos:

```sql
REVOKE ALL PRIVILEGES ON clientecorreo.* FROM 'usuarioDesarrollo'@'localhost';
```

### Eliminar un usuario:

```sql
DROP USER 'usuarioDesarrollo'@'localhost';
```

---

## Resumen

- Los **usuarios** controlan el acceso a la base de datos
- Cada usuario tiene **permisos específicos**
- **root** tiene acceso completo (solo para desarrollo)
- En **producción** usar usuarios con permisos limitados
- Las **credenciales** deben protegerse (variables de entorno)
- Los usuarios garantizan la **seguridad** de los datos
- Spring Boot se conecta usando las credenciales en `application.properties`
