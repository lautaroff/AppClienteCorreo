# Clave Primaria (Primary Key)

## ¿Qué es una Clave Primaria?

Una **Clave Primaria** (Primary Key o PK) es una columna o conjunto de columnas que identifica de manera **única** cada registro en una tabla. No puede haber dos registros con el mismo valor en la clave primaria.

---

## Características de una Clave Primaria

✅ **Unicidad**: Cada valor debe ser único en toda la tabla  
✅ **No nulo**: No puede contener valores NULL  
✅ **Inmutable**: Idealmente no debería cambiar  
✅ **Indexada**: Se crea automáticamente un índice para búsquedas rápidas  

---

## Clave Primaria en la Tabla CLIENTE

### Código Java

**Archivo:** `src/main/java/app/entidades/Cliente06.java` (líneas 19-26)

```java
@Entity
@Table(name = "cliente")
public class Cliente06 {
    
    @Column(name="DNI", nullable=false, length=10)
    @Id  // ← Esta anotación define la clave primaria
    private String dni;
    
    @Column(name="Nombre", nullable=false, length=50)
    private String nombre;
    
    @Column(name="Apellido", nullable=false, length=50)
    private String apellido;
}
```

### Análisis:

- **`@Id`**: Marca el campo `dni` como clave primaria
- **`nullable=false`**: Garantiza que no puede ser NULL
- **Tipo**: `String` (VARCHAR en SQL)
- **Longitud**: Máximo 10 caracteres

### SQL generado por Hibernate:

```sql
CREATE TABLE cliente (
    DNI VARCHAR(10) NOT NULL,
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    PRIMARY KEY (DNI)  -- ← Definición de clave primaria
);
```

### Visualización:

```
┌────────────┬──────────┬────────────┐
│    DNI     │  Nombre  │  Apellido  │
│ PRIMARY KEY│          │            │
├────────────┼──────────┼────────────┤
│ 12345678   │ Juan     │ Pérez      │  ✅ Único
│ 87654321   │ María    │ González   │  ✅ Único
│ 43152355   │ Lauti    │ Ferreyra   │  ✅ Único
│ 12345678   │ Pedro    │ López      │  ❌ ERROR: Duplicado
└────────────┴──────────┴────────────┘
```

---

## Clave Primaria en la Tabla CORREO

### Código Java

**Archivo:** `src/main/java/app/entidades/Correo06.java` (líneas 23-38)

```java
@Entity
@Table(name = "correo")
public class Correo06 {
    
    @Id  // ← Clave primaria
    @Column(name = "idCorreo", length = 6)
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // ← Auto-incremento
    private int idCorreo;
    
    @Column(name = "correo", length = 100, unique=true, nullable=false)
    private String correo;
    
    @JoinColumn(name = "cliente06DNIfk", referencedColumnName = "dni", nullable=false)
    @ManyToOne(fetch = FetchType.EAGER, cascade={CascadeType.ALL})
    private Cliente06 cliente06;
}
```

### Análisis:

- **`@Id`**: Marca `idCorreo` como clave primaria
- **`@GeneratedValue(strategy = GenerationType.IDENTITY)`**: 
  - El valor se genera **automáticamente**
  - Cada nuevo registro recibe el siguiente número disponible
  - No necesitamos asignar el valor manualmente
- **Tipo**: `int` (INTEGER en SQL)

### SQL generado:

```sql
CREATE TABLE correo (
    idCorreo INT AUTO_INCREMENT,  -- ← Auto-incremento
    correo VARCHAR(100) NOT NULL UNIQUE,
    cliente06DNIfk VARCHAR(10) NOT NULL,
    PRIMARY KEY (idCorreo),  -- ← Clave primaria
    FOREIGN KEY (cliente06DNIfk) REFERENCES cliente(DNI)
);
```

### Visualización:

```
┌───────────┬──────────────────────────┬─────────────────┐
│ idCorreo  │        correo            │ cliente06DNIfk  │
│PRIMARY KEY│                          │                 │
│AUTO_INCR. │                          │                 │
├───────────┼──────────────────────────┼─────────────────┤
│     1     │ juan@gmail.com           │   12345678      │  ✅ Auto
│     2     │ juan.perez@hotmail.com   │   12345678      │  ✅ Auto
│     3     │ maria@gmail.com          │   87654321      │  ✅ Auto
│     4     │ lauferreyraff@gmail.com  │   43152355      │  ✅ Auto
└───────────┴──────────────────────────┴─────────────────┘
```

---

## Tipos de Claves Primarias

### 1. Clave Primaria Natural (Cliente)

```java
@Id
private String dni;  // Dato que existe en el mundo real
```

**Características:**
- Tiene significado en el mundo real (DNI del cliente)
- Ya existe antes de crear el registro
- Puede ser usado por humanos para identificar

**Ventajas:**
- ✅ Fácil de entender
- ✅ No necesita generación automática

**Desventajas:**
- ⚠️ Puede cambiar (aunque raro)
- ⚠️ Puede ser largo

### 2. Clave Primaria Artificial/Subrogada (Correo)

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private int idCorreo;  // Número generado automáticamente
```

**Características:**
- No tiene significado en el mundo real
- Se genera automáticamente
- Solo sirve para identificar el registro

**Ventajas:**
- ✅ Nunca cambia
- ✅ Siempre único
- ✅ Eficiente (número entero)
- ✅ Corto y simple

**Desventajas:**
- ⚠️ No tiene significado para humanos

---

## Validación de Clave Primaria en el Código

### Verificar si existe un registro con esa clave

**Archivo:** `src/main/java/app/controladores/ClienteControlador.java` (líneas 33-62)

```java
@GetMapping("/guardar/{dni}/{nombre}/{apellido}")
public String guardar(@PathVariable("dni") String dni, 
                      @PathVariable("nombre") String nombre,
                      @PathVariable("apellido") String apellido) {
    
    // Buscar si ya existe un cliente con ese DNI (clave primaria)
    clienteNuevo = serviciosCliente.buscarPorId(dni);
    
    if (clienteNuevo == null) {
        // No existe, podemos crear el nuevo cliente
        clienteNuevo = new Cliente06();
        clienteNuevo.setDni(dni);
        clienteNuevo.setNombre(nombre);
        clienteNuevo.setApellido(apellido);
        serviciosCliente.guardar(clienteNuevo);
        return "Cliente agregado correctamente";
    } else {
        // Ya existe un cliente con ese DNI
        return "Existe un cliente con ese DNI: " + dni;
    }
}
```

### Método en el Servicio:

```java
@Override
public Cliente06 buscarPorId(String dni) {
    return clientesRepositorio.findById(dni).orElse(null);
}

@Override
public boolean existePorId(String dni) {
    return clientesRepositorio.existsById(dni);
}
```

---

## Operaciones con Claves Primarias

### Buscar por clave primaria (muy rápido):

```sql
-- Búsqueda por clave primaria (usa índice)
SELECT * FROM cliente WHERE DNI = '43152355';  -- ⚡ Muy rápido

-- Búsqueda por otro campo (sin índice)
SELECT * FROM cliente WHERE Nombre = 'Juan';  -- 🐌 Más lento
```

### Intentar insertar duplicado (genera error):

```sql
-- Primer registro
INSERT INTO cliente (DNI, Nombre, Apellido) 
VALUES ('12345678', 'Juan', 'Pérez');  -- ✅ OK

-- Intentar duplicar la clave primaria
INSERT INTO cliente (DNI, Nombre, Apellido) 
VALUES ('12345678', 'Pedro', 'López');  -- ❌ ERROR: Duplicate entry
```

**Error generado:**
```
ERROR 1062 (23000): Duplicate entry '12345678' for key 'PRIMARY'
```

---

## Estrategias de Generación de Claves

### GenerationType.IDENTITY (usado en nuestro proyecto):

```java
@GeneratedValue(strategy = GenerationType.IDENTITY)
private int idCorreo;
```

- La base de datos genera el valor (AUTO_INCREMENT)
- Cada INSERT obtiene el siguiente número
- Específico de MySQL

### Otras estrategias:

#### GenerationType.AUTO:
```java
@GeneratedValue(strategy = GenerationType.AUTO)
```
- JPA elige la mejor estrategia según la base de datos

#### GenerationType.SEQUENCE:
```java
@GeneratedValue(strategy = GenerationType.SEQUENCE)
```
- Usa secuencias de la base de datos (Oracle, PostgreSQL)

#### GenerationType.TABLE:
```java
@GeneratedValue(strategy = GenerationType.TABLE)
```
- Usa una tabla separada para generar IDs

---

## Índices y Claves Primarias

### Índice automático:

Cuando defines una clave primaria, MySQL crea automáticamente un **índice**:

```sql
SHOW INDEX FROM cliente;
```

**Resultado:**
```
+--------+------------+----------+--------------+-------------+
| Table  | Non_unique | Key_name | Seq_in_index | Column_name |
+--------+------------+----------+--------------+-------------+
| cliente|     0      | PRIMARY  |      1       | DNI         |
+--------+------------+----------+--------------+-------------+
```

**Beneficios del índice:**
- ⚡ Búsquedas muy rápidas por clave primaria
- ⚡ Joins eficientes con otras tablas
- ⚡ Ordenamiento rápido

---

## Restricciones de Clave Primaria

### En el código Java:

```java
@Id  // Define como clave primaria
@Column(name="DNI", nullable=false, length=10)  // No puede ser NULL
private String dni;
```

### En SQL:

```sql
CREATE TABLE cliente (
    DNI VARCHAR(10) NOT NULL,  -- No puede ser NULL
    PRIMARY KEY (DNI)          -- Debe ser único
);
```

### Intentar insertar NULL:

```sql
INSERT INTO cliente (DNI, Nombre, Apellido) 
VALUES (NULL, 'Juan', 'Pérez');  -- ❌ ERROR: Column 'DNI' cannot be null
```

---

## Consultas útiles sobre Claves Primarias

### Ver la definición de la tabla:

```sql
DESCRIBE cliente;
```

**Resultado:**
```
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| DNI      | varchar(10) | NO   | PRI | NULL    |       |  ← PRI = Primary Key
| Nombre   | varchar(50) | NO   |     | NULL    |       |
| Apellido | varchar(50) | NO   |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

### Ver las restricciones:

```sql
SHOW CREATE TABLE cliente;
```

---

## Comparación: Cliente vs Correo

| Aspecto              | Tabla CLIENTE          | Tabla CORREO           |
|----------------------|------------------------|------------------------|
| Clave Primaria       | DNI                    | idCorreo               |
| Tipo                 | Natural                | Artificial             |
| Tipo de dato         | VARCHAR(10)            | INT                    |
| Auto-incremento      | ❌ No                  | ✅ Sí                  |
| Asignación           | Manual                 | Automática             |
| Significado          | DNI del cliente        | Solo identificador     |

---

## Resumen

- La **clave primaria** identifica únicamente cada registro
- Debe ser **única** y **no nula**
- Puede ser **natural** (DNI) o **artificial** (idCorreo)
- Se define con la anotación **`@Id`** en JPA
- Puede ser **auto-incrementable** con `@GeneratedValue`
- Se crea automáticamente un **índice** para búsquedas rápidas
- Es fundamental para las **relaciones entre tablas** (claves foráneas)
- Garantiza la **integridad** de los datos
