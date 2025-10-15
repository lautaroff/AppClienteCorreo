# Clave Foránea (Foreign Key)

## ¿Qué es una Clave Foránea?

Una **Clave Foránea** (Foreign Key o FK) es una columna o conjunto de columnas en una tabla que hace referencia a la clave primaria de otra tabla. Establece una relación entre dos tablas.

---

## Clave Foránea en nuestro proyecto

### Código Java

**Archivo:** `src/main/java/app/entidades/Correo06.java` (líneas 23-38)

```java
@Entity
@Table(name = "correo")
public class Correo06 {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCorreo;
    
    @Column(name = "correo", length = 100, unique=true, nullable=false)
    private String correo;
    
    // ↓ CLAVE FORÁNEA ↓
    @JoinColumn(name = "cliente06DNIfk", referencedColumnName = "dni", nullable=false)
    @ManyToOne(fetch = FetchType.EAGER, cascade={CascadeType.ALL})
    private Cliente06 cliente06;
}
```

### Análisis detallado:

#### `@JoinColumn`:
```java
@JoinColumn(
    name = "cliente06DNIfk",        // Nombre de la columna FK en la tabla correo
    referencedColumnName = "dni",   // Columna referenciada en la tabla cliente
    nullable=false                  // No puede ser NULL (obligatorio)
)
```

#### `@ManyToOne`:
```java
@ManyToOne(
    fetch = FetchType.EAGER,        // Carga el cliente automáticamente
    cascade={CascadeType.ALL}       // Propaga operaciones al cliente
)
```

---

## SQL generado por Hibernate

```sql
CREATE TABLE correo (
    idCorreo INT AUTO_INCREMENT,
    correo VARCHAR(100) NOT NULL UNIQUE,
    cliente06DNIfk VARCHAR(10) NOT NULL,  -- ← CLAVE FORÁNEA
    PRIMARY KEY (idCorreo),
    FOREIGN KEY (cliente06DNIfk) REFERENCES cliente(DNI)  -- ← Definición FK
);
```

---

## Visualización de la Relación

```
┌─────────────────────────┐         ┌──────────────────────────┐
│   Tabla: cliente        │         │   Tabla: correo          │
├─────────────────────────┤         ├──────────────────────────┤
│ DNI (PK)    VARCHAR(10) │◄────────│ idCorreo (PK)      INT   │
│ Nombre      VARCHAR(50) │         │ correo         VARCHAR   │
│ Apellido    VARCHAR(50) │         │ cliente06DNIfk (FK) ←────┘
└─────────────────────────┘         └──────────────────────────┘
       ▲                                       │
       │                                       │
       └───────────────────────────────────────┘
              La FK referencia a la PK
```

### Con datos:

```
TABLA CLIENTE:
┌────────────┬──────────┬────────────┐
│    DNI     │  Nombre  │  Apellido  │
│   (PK)     │          │            │
├────────────┼──────────┼────────────┤
│ 12345678   │ Juan     │ Pérez      │ ◄─┐
│ 87654321   │ María    │ González   │ ◄─┼─┐
│ 43152355   │ Lauti    │ Ferreyra   │ ◄─┼─┼─┐
└────────────┴──────────┴────────────┘   │ │ │
                                          │ │ │
TABLA CORREO:                             │ │ │
┌───────────┬──────────────────────────┬─────────────────┐
│ idCorreo  │        correo            │ cliente06DNIfk  │
│   (PK)    │                          │      (FK)       │
├───────────┼──────────────────────────┼─────────────────┤
│     1     │ juan@gmail.com           │   12345678   ───┘
│     2     │ juan.perez@hotmail.com   │   12345678   ───┐
│     3     │ maria@gmail.com          │   87654321   ───┼─┘
│     4     │ lauferreyraff@gmail.com  │   43152355   ───┼───┘
└───────────┴──────────────────────────┴─────────────────┘
```

---

## Características de una Clave Foránea

✅ **Referencia**: Apunta a la clave primaria de otra tabla  
✅ **Integridad**: Garantiza que el valor existe en la tabla referenciada  
✅ **Relación**: Establece vínculos entre tablas  
✅ **Restricción**: No permite valores que no existan en la tabla padre  

---

## Creación de Registros con Clave Foránea

### En el Controlador

**Archivo:** `src/main/java/app/controladores/CorreoControlador.java` (líneas 38-58)

```java
@GetMapping("/guardar/{dni}/{correo}")
public String guardar(@PathVariable("dni") String dni, 
                     @PathVariable("correo") String correo) {
    
    // 1. Buscar el cliente (tabla padre) usando la clave primaria
    cliente = serviciosCliente.buscarPorId(dni);
    
    if (cliente == null) {
        // No se puede crear el correo si el cliente no existe
        return "No existe un cliente con el DNI: " + dni;
    }
    
    // 2. Crear el nuevo correo
    correoNuevo = new Correo06();
    
    // 3. Establecer la relación (asignar la clave foránea)
    correoNuevo.setCliente06(cliente);  // ← Asigna la FK
    correoNuevo.setCorreo(correo);
    
    // 4. Guardar el correo
    serviciosCorreo.guardar(correoNuevo);
    
    return "Correo agregado correctamente para el dni: " + dni;
}
```

### SQL generado:

```sql
-- Hibernate primero verifica que el cliente existe
SELECT * FROM cliente WHERE DNI = '43152355';

-- Si existe, inserta el correo con la FK
INSERT INTO correo (correo, cliente06DNIfk) 
VALUES ('lauferreyraff@gmail.com', '43152355');
```

---

## Restricciones de Integridad Referencial

### 1. No se puede insertar un correo con DNI inexistente:

```sql
-- Cliente con DNI '99999999' NO existe
INSERT INTO correo (correo, cliente06DNIfk) 
VALUES ('test@gmail.com', '99999999');

-- ❌ ERROR: Cannot add or update a child row: 
-- a foreign key constraint fails
```

### 2. No se puede eliminar un cliente que tiene correos:

```sql
-- Cliente '12345678' tiene correos asociados
DELETE FROM cliente WHERE DNI = '12345678';

-- ❌ ERROR: Cannot delete or update a parent row: 
-- a foreign key constraint fails
```

**Solución:** Primero eliminar los correos, luego el cliente:

```sql
-- 1. Eliminar los correos del cliente
DELETE FROM correo WHERE cliente06DNIfk = '12345678';

-- 2. Ahora sí se puede eliminar el cliente
DELETE FROM cliente WHERE DNI = '12345678';
```

---

## Cascade Types (Propagación de Operaciones)

### En el código:

```java
@ManyToOne(fetch = FetchType.EAGER, cascade={CascadeType.ALL})
private Cliente06 cliente06;
```

### Tipos de Cascade:

| CascadeType    | Descripción                                           | Ejemplo                                    |
|----------------|-------------------------------------------------------|--------------------------------------------|
| ALL            | Propaga todas las operaciones                         | Usado en nuestro proyecto                  |
| PERSIST        | Al guardar el correo, guarda el cliente si es nuevo   | `save(correo)` → `save(cliente)`          |
| MERGE          | Al actualizar el correo, actualiza el cliente         | `update(correo)` → `update(cliente)`      |
| REMOVE         | Al eliminar el correo, elimina el cliente             | `delete(correo)` → `delete(cliente)` ⚠️   |
| REFRESH        | Al refrescar el correo, refresca el cliente           | `refresh(correo)` → `refresh(cliente)`    |
| DETACH         | Al desconectar el correo, desconecta el cliente       | `detach(correo)` → `detach(cliente)`      |

⚠️ **Cuidado con CascadeType.REMOVE**: En nuestro caso, eliminar un correo NO debería eliminar el cliente.

---

## Fetch Types (Estrategias de Carga)

### FetchType.EAGER (usado en nuestro proyecto):

```java
@ManyToOne(fetch = FetchType.EAGER)
private Cliente06 cliente06;
```

**Comportamiento:**
- Carga el cliente **automáticamente** al cargar el correo
- Una sola consulta SQL con JOIN

```sql
SELECT c.*, cl.* 
FROM correo c 
INNER JOIN cliente cl ON c.cliente06DNIfk = cl.DNI 
WHERE c.idCorreo = 1;
```

### FetchType.LAZY (alternativa):

```java
@ManyToOne(fetch = FetchType.LAZY)
private Cliente06 cliente06;
```

**Comportamiento:**
- Carga el cliente **solo cuando se accede** a él
- Dos consultas SQL separadas
- Más eficiente si no siempre necesitas el cliente

---

## Consultas con Claves Foráneas

### Listar correos con información del cliente

**Archivo:** `src/main/java/app/servicios/ServiciosCorreo.java` (líneas 52-56)

```java
@Override
public List<Correo06> listarCorreosConClientes() {
    return correosRepositorio.findAll().stream()
        .filter(correo -> correo.getCliente06() != null)
        .toList();
}
```

**SQL equivalente:**
```sql
SELECT c.idCorreo, c.correo, cl.DNI, cl.Nombre, cl.Apellido
FROM correo c
INNER JOIN cliente cl ON c.cliente06DNIfk = cl.DNI;
```

### Listar correos de un cliente específico:

```java
@Override
public List<Correo06> listarPorDni(String dni) {
    return correosRepositorio.findAll().stream()
        .filter(correo -> correo.getCliente06() != null && 
                         correo.getCliente06().getDni().equals(dni))
        .toList();
}
```

**SQL equivalente:**
```sql
SELECT * FROM correo 
WHERE cliente06DNIfk = '43152355';
```

---

## Acceso a datos relacionados en el código

### Desde un objeto Correo, acceder al Cliente:

```java
Correo06 correo = serviciosCorreo.buscarPorId("1");

// Acceder al cliente relacionado a través de la FK
Cliente06 cliente = correo.getCliente06();

System.out.println("Correo: " + correo.getCorreo());
System.out.println("Pertenece a: " + cliente.getNombre() + " " + cliente.getApellido());
System.out.println("DNI: " + cliente.getDni());
```

**Salida:**
```
Correo: juan@gmail.com
Pertenece a: Juan Pérez
DNI: 12345678
```

---

## Validación de Clave Foránea en el Controlador

```java
@GetMapping("/guardar/{dni}/{correo}")
public String guardar(@PathVariable("dni") String dni, 
                     @PathVariable("correo") String correo) {
    
    // Validar que el cliente existe antes de crear el correo
    cliente = serviciosCliente.buscarPorId(dni);
    
    if (cliente == null) {
        // La FK no puede apuntar a un registro inexistente
        return "No existe un cliente con el DNI: " + dni + 
               ". No se ha agregado un correo nuevo.";
    }
    
    // Cliente existe, podemos crear el correo
    correoNuevo = new Correo06();
    correoNuevo.setCliente06(cliente);  // Establecer la FK
    correoNuevo.setCorreo(correo);
    serviciosCorreo.guardar(correoNuevo);
    
    return "Correo agregado correctamente para el dni: " + dni;
}
```

---

## Comandos SQL útiles

### Ver las claves foráneas de una tabla:

```sql
SHOW CREATE TABLE correo;
```

**Resultado:**
```sql
CREATE TABLE `correo` (
  `idCorreo` int NOT NULL AUTO_INCREMENT,
  `correo` varchar(100) NOT NULL,
  `cliente06DNIfk` varchar(10) NOT NULL,
  PRIMARY KEY (`idCorreo`),
  UNIQUE KEY `correo` (`correo`),
  KEY `cliente06DNIfk` (`cliente06DNIfk`),
  CONSTRAINT `correo_ibfk_1` FOREIGN KEY (`cliente06DNIfk`) 
    REFERENCES `cliente` (`DNI`)
) ENGINE=InnoDB;
```

### Ver información de restricciones:

```sql
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'correo' 
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

---

## Ventajas de usar Claves Foráneas

✅ **Integridad Referencial**: Garantiza que las relaciones sean válidas  
✅ **Consistencia**: Evita datos huérfanos (correos sin cliente)  
✅ **Navegación**: Fácil acceso a datos relacionados  
✅ **Validación automática**: La base de datos valida las relaciones  
✅ **Documentación**: La estructura muestra claramente las relaciones  

---

## Errores comunes

### Error 1: Intentar insertar FK inexistente

```
Cannot add or update a child row: a foreign key constraint fails
```

**Causa:** El DNI del cliente no existe en la tabla cliente

**Solución:** Verificar que el cliente existe antes de crear el correo

### Error 2: Intentar eliminar registro referenciado

```
Cannot delete or update a parent row: a foreign key constraint fails
```

**Causa:** Intentar eliminar un cliente que tiene correos asociados

**Solución:** Eliminar primero los correos, luego el cliente

---

## Resumen

- La **clave foránea** establece relaciones entre tablas
- Referencia a la **clave primaria** de otra tabla
- Se define con **`@JoinColumn`** y **`@ManyToOne`** en JPA
- Garantiza la **integridad referencial**
- Permite **navegar** entre objetos relacionados
- **Cascade** controla la propagación de operaciones
- **FetchType** controla cuándo se cargan los datos relacionados
- Es fundamental para mantener la **consistencia** de los datos
