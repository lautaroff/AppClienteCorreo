# Documentación del Proyecto AppClienteCorreo

## 📚 Índice de Contenidos

Esta documentación explica los conceptos fundamentales de bases de datos utilizando el código fuente del proyecto **AppClienteCorreo** como ejemplo práctico.

---

## 📖 Documentos Disponibles

### 1. [Base de Datos](01-base-de-datos.md)
- ¿Qué es una base de datos?
- Configuración en el proyecto
- Conexión con MySQL
- Estructura de la base de datos `clientecorreo`

### 2. [Tablas](02-tablas.md)
- Definición de tablas
- Tabla `cliente`
- Tabla `correo`
- Mapeo Java ↔ SQL con JPA/Hibernate
- Operaciones CRUD sobre tablas

### 3. [Columnas](03-columnas.md)
- ¿Qué es una columna?
- Tipos de datos
- Restricciones (NOT NULL, UNIQUE, etc.)
- Columnas en `cliente` y `correo`
- Anotaciones JPA (@Column, @Id, etc.)

### 4. [Registros](04-registros.md)
- ¿Qué es un registro?
- Operaciones CRUD sobre registros
- Creación, lectura, actualización y eliminación
- Ejemplos con código Java
- Arquitectura de capas (Controlador → Servicio → Repositorio)

### 5. [Usuarios](05-usuarios.md)
- Usuarios de base de datos
- Configuración de credenciales
- Tipos de usuarios (root, desarrollo, producción)
- Permisos y seguridad
- Buenas prácticas

### 6. [Clave Primaria](06-clave-primaria.md)
- ¿Qué es una clave primaria?
- Características y restricciones
- Claves naturales vs artificiales
- Auto-incremento con @GeneratedValue
- Índices automáticos

### 7. [Clave Foránea](07-clave-foranea.md)
- ¿Qué es una clave foránea?
- Implementación con @JoinColumn y @ManyToOne
- Cascade types
- Fetch types (EAGER vs LAZY)
- Validación de integridad

### 8. [Relaciones entre Tablas](08-relaciones-entre-tablas.md)
- Tipos de relaciones (1:1, 1:N, N:M)
- Relación Cliente ↔ Correo (1:N)
- Navegación entre objetos relacionados
- Consultas con JOIN
- Cardinalidad

### 9. [Integridad Referencial](09-integridad-referencial.md)
- ¿Qué es la integridad referencial?
- Reglas de inserción, actualización y eliminación
- ON DELETE y ON UPDATE
- Manejo de excepciones
- Validación en el código

---

## 🎯 Estructura del Proyecto

```
AppClienteCorreo/
├── src/main/java/app/
│   ├── entidades/
│   │   ├── Cliente06.java          ← Entidad Cliente
│   │   └── Correo06.java           ← Entidad Correo
│   ├── controladores/
│   │   ├── ClienteControlador.java ← API REST Cliente
│   │   └── CorreoControlador.java  ← API REST Correo
│   ├── servicios/
│   │   ├── ServiciosCliente.java   ← Lógica de negocio Cliente
│   │   └── ServiciosCorreo.java    ← Lógica de negocio Correo
│   ├── repositorios/
│   │   ├── ClientesRepositorio.java ← Acceso a datos Cliente
│   │   └── CorreosRepositorio.java  ← Acceso a datos Correo
│   └── config/
│       └── CorsConfig.java         ← Configuración CORS
├── src/main/resources/
│   └── application.properties      ← Configuración BD
└── frontend/
    └── src/
        ├── pages/
        │   ├── AltaClientes.jsx    ← Formulario clientes
        │   ├── AltaCorreos.jsx     ← Formulario correos
        │   └── Listados.jsx        ← Visualización datos
        └── components/
            └── Navbar.jsx          ← Navegación
```

---

## 🗄️ Diagrama de Base de Datos

```
┌─────────────────────────────────────┐
│   Base de Datos: clientecorreo      │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Tabla: cliente             │   │
│  ├─────────────────────────────┤   │
│  │ PK  DNI       VARCHAR(10)   │   │
│  │     Nombre    VARCHAR(50)   │   │
│  │     Apellido  VARCHAR(50)   │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│             │ 1:N                   │
│             │                       │
│  ┌──────────▼──────────────────┐   │
│  │  Tabla: correo              │   │
│  ├─────────────────────────────┤   │
│  │ PK  idCorreo      INT       │   │
│  │     correo        VARCHAR   │   │
│  │ FK  cliente06DNIfk VARCHAR  │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 🚀 Tecnologías Utilizadas

### Backend:
- **Java 21**
- **Spring Boot 3.4.5**
- **Spring Data JPA** (ORM)
- **Hibernate** (Implementación JPA)
- **MySQL 8.0** (Base de datos)
- **Maven** (Gestión de dependencias)

### Frontend:
- **React 18**
- **Vite** (Build tool)
- **React Router** (Navegación)

---

## 📝 Conceptos Clave Explicados

### ORM (Object-Relational Mapping)
JPA/Hibernate convierte automáticamente entre:
- **Clases Java** ↔ **Tablas SQL**
- **Objetos** ↔ **Registros**
- **Atributos** ↔ **Columnas**

### Arquitectura en Capas

```
┌─────────────────────────────────────┐
│  CONTROLADOR (REST API)             │  ← Recibe peticiones HTTP
│  @RestController                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  SERVICIO (Lógica de negocio)       │  ← Procesa y valida
│  @Service                           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  REPOSITORIO (Acceso a datos)       │  ← Interactúa con BD
│  @Repository extends JpaRepository  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  BASE DE DATOS (MySQL)               │  ← Almacena datos
└─────────────────────────────────────┘
```

---

## 🎓 Orden de Lectura Recomendado

Para una mejor comprensión, se recomienda leer los documentos en este orden:

1. **Base de Datos** - Fundamento general
2. **Tablas** - Estructura de almacenamiento
3. **Columnas** - Definición de campos
4. **Registros** - Datos individuales
5. **Usuarios** - Seguridad y acceso
6. **Clave Primaria** - Identificación única
7. **Clave Foránea** - Referencias entre tablas
8. **Relaciones** - Conexiones lógicas
9. **Integridad Referencial** - Consistencia de datos

---

## 💡 Ejemplos Prácticos

Cada documento incluye:
- ✅ Código Java real del proyecto
- ✅ SQL generado por Hibernate
- ✅ Diagramas visuales
- ✅ Ejemplos de uso
- ✅ Errores comunes y soluciones
- ✅ Buenas prácticas

---

## 🔗 Enlaces Útiles

- [Documentación Spring Boot](https://spring.io/projects/spring-boot)
- [Documentación JPA](https://spring.io/projects/spring-data-jpa)
- [Documentación MySQL](https://dev.mysql.com/doc/)
- [Documentación React](https://react.dev/)

---

## 📧 Contacto

Proyecto desarrollado para el curso de Programación 3.

**Autor:** Lautaro Ferreyra  
**DNI:** 43152355  
**Email:** lauferreyraff@gmail.com

---

## 📄 Licencia

Este proyecto es de uso educativo.

---

**Última actualización:** Octubre 2025
