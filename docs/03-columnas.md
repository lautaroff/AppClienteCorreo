# Columnas

## ¿Qué es una Columna?

Una **Columna** (también llamada **campo** o **atributo**) es cada una de las divisiones verticales de una tabla que define un tipo específico de dato que se almacenará.

Cada columna tiene:
- **Nombre**: Identificador único dentro de la tabla
- **Tipo de dato**: Define qué tipo de información puede almacenar
- **Restricciones**: Reglas que debe cumplir el dato

---

## Columnas en la Tabla CLIENTE

### Código Java:

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

### Análisis de cada columna:

#### 1. Columna DNI

```java
@Column(name="DNI", nullable=false, length=10)
@Id
private String dni;
```

**Características:**
- **Nombre en BD**: `DNI`
- **Tipo de dato**: `VARCHAR(10)` - Cadena de texto de máximo 10 caracteres
- **Restricciones**: 
  - `nullable=false` → **NOT NULL** (obligatorio, no puede estar vacío)
  - `@Id` → **PRIMARY KEY** (clave primaria, identifica únicamente cada registro)
- **Propósito**: Almacenar el documento de identidad del cliente

#### 2. Columna Nombre

```java
@Column(name="Nombre", nullable=false, length=50)
private String nombre;
```

**Características:**
- **Nombre en BD**: `Nombre`
- **Tipo de dato**: `VARCHAR(50)` - Cadena de texto de máximo 50 caracteres
- **Restricciones**: 
  - `nullable=false` → **NOT NULL** (obligatorio)
- **Propósito**: Almacenar el nombre del cliente

#### 3. Columna Apellido

```java
@Column(name="Apellido", nullable=false, length=50)
private String apellido;
```

**Características:**
- **Nombre en BD**: `Apellido`
- **Tipo de dato**: `VARCHAR(50)` - Cadena de texto de máximo 50 caracteres
- **Restricciones**: 
  - `nullable=false` → **NOT NULL** (obligatorio)
- **Propósito**: Almacenar el apellido del cliente

---

## Columnas en la Tabla CORREO

### Código Java:

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

### Análisis de cada columna:

#### 1. Columna idCorreo

```java
@Id
@Column(name = "idCorreo", length = 6)
@GeneratedValue(strategy = GenerationType.IDENTITY)
private int idCorreo;
```

**Características:**
- **Nombre en BD**: `idCorreo`
- **Tipo de dato**: `INT` - Número entero
- **Restricciones**: 
  - `@Id` → **PRIMARY KEY** (clave primaria)
  - `@GeneratedValue(strategy = GenerationType.IDENTITY)` → **AUTO_INCREMENT** (se genera automáticamente)
- **Propósito**: Identificador único de cada correo electrónico

#### 2. Columna correo

```java
@Column(name = "correo", length = 100, unique=true, nullable=false)
private String correo;
```

**Características:**
- **Nombre en BD**: `correo`
- **Tipo de dato**: `VARCHAR(100)` - Cadena de texto de máximo 100 caracteres
- **Restricciones**: 
  - `nullable=false` → **NOT NULL** (obligatorio)
  - `unique=true` → **UNIQUE** (no puede haber correos duplicados)
- **Propósito**: Almacenar la dirección de correo electrónico

#### 3. Columna cliente06DNIfk (Clave Foránea)

```java
@JoinColumn(name = "cliente06DNIfk", referencedColumnName = "dni", nullable=false)
@ManyToOne(fetch = FetchType.EAGER, cascade={CascadeType.ALL})
private Cliente06 cliente06;
```

**Características:**
- **Nombre en BD**: `cliente06DNIfk`
- **Tipo de dato**: `VARCHAR(10)` - Mismo tipo que la columna DNI de cliente
- **Restricciones**: 
  - `nullable=false` → **NOT NULL** (obligatorio)
  - `@JoinColumn` → **FOREIGN KEY** (clave foránea que referencia a cliente.DNI)
- **Propósito**: Relacionar cada correo con su cliente correspondiente

---

## Tipos de Datos más comunes

| Tipo Java  | Tipo SQL      | Descripción                          | Ejemplo              |
|------------|---------------|--------------------------------------|----------------------|
| String     | VARCHAR(n)    | Texto de longitud variable           | "Juan", "correo@..." |
| int        | INT           | Número entero                        | 1, 42, 1000          |
| long       | BIGINT        | Número entero grande                 | 123456789            |
| double     | DOUBLE        | Número decimal                       | 3.14, 99.99          |
| boolean    | BOOLEAN/BIT   | Verdadero o falso                    | true, false          |
| Date       | DATE          | Fecha                                | 2025-10-15           |
| LocalDateTime | DATETIME   | Fecha y hora                         | 2025-10-15 14:30:00  |

---

## Restricciones de Columnas

### En el código Java:

| Anotación JPA              | Restricción SQL | Significado                                    |
|----------------------------|-----------------|------------------------------------------------|
| `@Id`                      | PRIMARY KEY     | Identifica únicamente cada registro            |
| `nullable=false`           | NOT NULL        | El campo es obligatorio                        |
| `unique=true`              | UNIQUE          | No puede haber valores duplicados              |
| `length=50`                | VARCHAR(50)     | Longitud máxima del texto                      |
| `@GeneratedValue`          | AUTO_INCREMENT  | Valor generado automáticamente                 |
| `@JoinColumn`              | FOREIGN KEY     | Referencia a otra tabla                        |

---

## Visualización de Columnas

### Tabla CLIENTE:

```
┌─────────────────────────────────────────────────┐
│                 Tabla: cliente                  │
├────────────┬──────────┬────────────┬────────────┤
│ Columna 1  │ Columna 2│ Columna 3  │            │
│    DNI     │  Nombre  │  Apellido  │            │
│ VARCHAR(10)│VARCHAR(50)│VARCHAR(50)│            │
│ PRIMARY KEY│ NOT NULL │ NOT NULL   │            │
├────────────┼──────────┼────────────┼────────────┤
│ 12345678   │ Juan     │ Pérez      │ ← Registro │
│ 87654321   │ María    │ González   │ ← Registro │
└────────────┴──────────┴────────────┴────────────┘
```

### Tabla CORREO:

```
┌──────────────────────────────────────────────────────────────┐
│                      Tabla: correo                           │
├───────────┬──────────────────────────┬─────────────────┬─────┤
│ Columna 1 │      Columna 2           │   Columna 3     │     │
│ idCorreo  │        correo            │ cliente06DNIfk  │     │
│    INT    │     VARCHAR(100)         │  VARCHAR(10)    │     │
│PRIMARY KEY│  UNIQUE, NOT NULL        │ FOREIGN KEY     │     │
│AUTO_INCR. │                          │                 │     │
├───────────┼──────────────────────────┼─────────────────┼─────┤
│     1     │ juan@gmail.com           │   12345678      │ ←   │
│     2     │ maria@gmail.com          │   87654321      │ ←   │
└───────────┴──────────────────────────┴─────────────────┴─────┘
```

---

## Consultas SQL para ver columnas

### Ver todas las columnas de una tabla:

```sql
DESCRIBE cliente;
-- o
SHOW COLUMNS FROM cliente;
```

**Resultado:**
```
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| DNI      | varchar(10) | NO   | PRI | NULL    |       |
| Nombre   | varchar(50) | NO   |     | NULL    |       |
| Apellido | varchar(50) | NO   |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

---

## Buenas prácticas para columnas

✅ **Nombres descriptivos**: Usar nombres claros que indiquen qué contiene la columna  
✅ **Tipo de dato apropiado**: Elegir el tipo correcto según la información  
✅ **Longitud adecuada**: No usar VARCHAR(255) si solo necesitas 50 caracteres  
✅ **Restricciones necesarias**: Usar NOT NULL cuando el campo es obligatorio  
✅ **Índices**: Las claves primarias y foráneas se indexan automáticamente  

---

## Mapeo Java ↔ SQL

```
Atributo Java (private String dni)  →  Columna SQL (DNI VARCHAR(10))
Anotación @Column                    →  Definición de columna
Tipo de dato Java                    →  Tipo de dato SQL
```

JPA/Hibernate realiza automáticamente la conversión entre los atributos de la clase Java y las columnas de la tabla SQL.
