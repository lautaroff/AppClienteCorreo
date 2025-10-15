# Tablas

## ¿Qué es una Tabla?

Una **Tabla** es una estructura dentro de una base de datos que organiza los datos en filas (registros) y columnas (campos). Es similar a una hoja de cálculo de Excel.

## Tablas en nuestro proyecto

En el proyecto **AppClienteCorreo** tenemos **2 tablas**:

### 1. Tabla `cliente`
### 2. Tabla `correo`

---

## Tabla CLIENTE

### Definición en el código Java

**Archivo:** `src/main/java/app/entidades/Cliente06.java` (líneas 8-26)

```java
@Entity
@Table(name = "cliente")
public class Cliente06 {
    
    @Column(name="DNI", nullable=false, length=10)
    @Id
    private String dni;
    
    @Column(name="Nombre", nullable=false, length=50)
    private String nombre;
    
    @Column(name="Apellido", nullable=false, length=50)
    private String apellido;
}
```

### Explicación de las anotaciones:

- **`@Entity`**: Indica que esta clase Java representa una tabla en la base de datos
- **`@Table(name = "cliente")`**: Define el nombre de la tabla en MySQL
- **`@Column`**: Define las características de cada columna

### Estructura de la tabla cliente:

| Columna   | Tipo        | Restricciones          | Descripción                    |
|-----------|-------------|------------------------|--------------------------------|
| DNI       | VARCHAR(10) | PRIMARY KEY, NOT NULL  | Documento de identidad único   |
| Nombre    | VARCHAR(50) | NOT NULL               | Nombre del cliente             |
| Apellido  | VARCHAR(50) | NOT NULL               | Apellido del cliente           |

### SQL generado por Hibernate:

```sql
CREATE TABLE cliente (
    DNI VARCHAR(10) NOT NULL,
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    PRIMARY KEY (DNI)
);
```

---

## Tabla CORREO

### Definición en el código Java

**Archivo:** `src/main/java/app/entidades/Correo06.java` (líneas 14-38)

```java
@Entity
@Table(name = "correo")
public class Correo06 {
    
    @Id
    @Column(name = "idCorreo", length = 6)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCorreo;
    
    @Column(name = "correo", length = 100, unique=true, nullable=false)
    private String correo;
    
    @JoinColumn(name = "cliente06DNIfk", referencedColumnName = "dni", nullable=false)
    @ManyToOne(fetch = FetchType.EAGER, cascade={CascadeType.ALL})
    private Cliente06 cliente06;
}
```

### Estructura de la tabla correo:

| Columna          | Tipo         | Restricciones                    | Descripción                        |
|------------------|--------------|----------------------------------|------------------------------------|
| idCorreo         | INT          | PRIMARY KEY, AUTO_INCREMENT      | Identificador único del correo     |
| correo           | VARCHAR(100) | UNIQUE, NOT NULL                 | Dirección de correo electrónico    |
| cliente06DNIfk   | VARCHAR(10)  | FOREIGN KEY, NOT NULL            | DNI del cliente (clave foránea)    |

### SQL generado por Hibernate:

```sql
CREATE TABLE correo (
    idCorreo INT AUTO_INCREMENT,
    correo VARCHAR(100) NOT NULL UNIQUE,
    cliente06DNIfk VARCHAR(10) NOT NULL,
    PRIMARY KEY (idCorreo),
    FOREIGN KEY (cliente06DNIfk) REFERENCES cliente(DNI)
);
```

---

## Visualización de las Tablas

### Tabla CLIENTE (ejemplo con datos):

```
┌────────────┬──────────┬────────────┐
│    DNI     │  Nombre  │  Apellido  │
├────────────┼──────────┼────────────┤
│ 12345678   │ Juan     │ Pérez      │
│ 87654321   │ María    │ González   │
│ 43152355   │ Lauti    │ Ferreyra   │
└────────────┴──────────┴────────────┘
```

### Tabla CORREO (ejemplo con datos):

```
┌───────────┬──────────────────────────┬─────────────────┐
│ idCorreo  │        correo            │ cliente06DNIfk  │
├───────────┼──────────────────────────┼─────────────────┤
│     1     │ juan@gmail.com           │   12345678      │
│     2     │ juan.perez@hotmail.com   │   12345678      │
│     3     │ maria@gmail.com          │   87654321      │
│     4     │ lauferreyraff@gmail.com  │   43152355      │
└───────────┴──────────────────────────┴─────────────────┘
```

---

## Operaciones CRUD sobre las Tablas

### Consultar todas las tablas de la base de datos:

```sql
SHOW TABLES;
```

### Ver la estructura de una tabla:

```sql
DESCRIBE cliente;
DESCRIBE correo;
```

### Consultar todos los registros:

```sql
SELECT * FROM cliente;
SELECT * FROM correo;
```

---

## Características importantes

✅ **Cada tabla tiene un propósito específico**  
✅ **Las tablas están relacionadas entre sí** (cliente ↔ correo)  
✅ **Hibernate crea automáticamente las tablas** desde las clases Java  
✅ **Las restricciones garantizan la integridad de los datos**  
✅ **Los nombres de las tablas son en minúsculas** por convención  

---

## Relación entre Clases Java y Tablas SQL

```
Clase Java (Cliente06.java)  →  Tabla SQL (cliente)
Clase Java (Correo06.java)   →  Tabla SQL (correo)
```

Spring Boot + JPA/Hibernate se encargan de la conversión automática entre objetos Java y registros de base de datos, esto se conoce como **ORM (Object-Relational Mapping)**.
