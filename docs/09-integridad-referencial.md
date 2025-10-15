# Integridad Referencial

## ¿Qué es la Integridad Referencial?

La **Integridad Referencial** es un conjunto de reglas que garantizan que las relaciones entre tablas sean válidas y consistentes. Asegura que las claves foráneas siempre apunten a registros existentes en la tabla referenciada.

---

## Reglas de Integridad Referencial

### 1. Regla de Inserción

**No se puede insertar un registro hijo si el padre no existe**

```sql
-- ❌ ERROR: Cliente '99999999' no existe
INSERT INTO correo (correo, cliente06DNIfk)
VALUES ('test@gmail.com', '99999999');

-- Error: Cannot add or update a child row:
-- a foreign key constraint fails
```

### 2. Regla de Actualización

**No se puede actualizar una clave foránea a un valor inexistente**

```sql
-- ❌ ERROR: Cliente '88888888' no existe
UPDATE correo
SET cliente06DNIfk = '88888888'
WHERE idCorreo = 1;

-- Error: Cannot add or update a child row:
-- a foreign key constraint fails
```

### 3. Regla de Eliminación

**No se puede eliminar un registro padre si tiene hijos**

```sql
-- ❌ ERROR: Cliente '12345678' tiene correos asociados
DELETE FROM cliente WHERE DNI = '12345678';

-- Error: Cannot delete or update a parent row:
-- a foreign key constraint fails
```

---

## Integridad Referencial en nuestro proyecto

### Definición en el código Java:

```java
@Entity
@Table(name = "correo")
public class Correo06 {

    @JoinColumn(
        name = "cliente06DNIfk",        // Columna FK
        referencedColumnName = "dni",   // Columna PK referenciada
        nullable=false                  // ← No puede ser NULL
    )
    @ManyToOne(
        fetch = FetchType.EAGER,
        cascade={CascadeType.ALL}
    )
    private Cliente06 cliente06;
}
```

### SQL generado:

```sql
CREATE TABLE correo (
    idCorreo INT AUTO_INCREMENT,
    correo VARCHAR(100) NOT NULL UNIQUE,
    cliente06DNIfk VARCHAR(10) NOT NULL,  -- No puede ser NULL
    PRIMARY KEY (idCorreo),
    FOREIGN KEY (cliente06DNIfk) REFERENCES cliente(DNI)
        ON DELETE RESTRICT   -- No permite eliminar padre con hijos
        ON UPDATE CASCADE    -- Actualiza FK si cambia PK
);
```

---

## Validación en el Controlador

### Verificar que el cliente existe antes de crear el correo:

```java
@GetMapping("/guardar/{dni}/{correo}")
public String guardar(@PathVariable("dni") String dni,
                     @PathVariable("correo") String correo) {

    // ↓ VALIDACIÓN DE INTEGRIDAD REFERENCIAL ↓
    cliente = serviciosCliente.buscarPorId(dni);

    if (cliente == null) {
        // Evitar violación de integridad referencial
        return "No existe un cliente con el DNI: " + dni +
               ". No se ha agregado un correo nuevo.";
    }

    // Cliente existe, se puede crear el correo
    correoNuevo = new Correo06();
    correoNuevo.setCliente06(cliente);  // FK válida
    correoNuevo.setCorreo(correo);
    serviciosCorreo.guardar(correoNuevo);

    return "Correo agregado correctamente para el dni: " + dni;
}
```

---

## Escenarios de Violación de Integridad

### Escenario 1: Insertar correo con DNI inexistente

**Intento:**

```java
Correo06 correo = new Correo06();
correo.setCorreo("test@gmail.com");

// Cliente con DNI '99999999' no existe
Cliente06 clienteInexistente = new Cliente06();
clienteInexistente.setDni("99999999");
correo.setCliente06(clienteInexistente);

serviciosCorreo.guardar(correo);  // ❌ ERROR
```

**Error generado:**

```
org.hibernate.exception.ConstraintViolationException:
could not execute statement
```

**Solución:**

```java
// Primero verificar que el cliente existe
Cliente06 cliente = serviciosCliente.buscarPorId("99999999");
if (cliente == null) {
    // Crear el cliente primero
    cliente = new Cliente06("99999999", "Nuevo", "Cliente");
    serviciosCliente.guardar(cliente);
}

// Ahora sí crear el correo
Correo06 correo = new Correo06();
correo.setCliente06(cliente);
correo.setCorreo("test@gmail.com");
serviciosCorreo.guardar(correo);  // ✅ OK
```

---

### Escenario 2: Eliminar cliente con correos

**Intento:**

```java
// Cliente '12345678' tiene 2 correos asociados
serviciosCliente.eliminarPorId("12345678");  // ❌ ERROR
```

**Error generado:**

```
Cannot delete or update a parent row:
a foreign key constraint fails
```

**Solución 1: Eliminar correos primero**

```java
// 1. Obtener todos los correos del cliente
List<Correo06> correos = serviciosCorreo.listarPorDni("12345678");

// 2. Eliminar cada correo
for (Correo06 correo : correos) {
    serviciosCorreo.eliminarPorId(String.valueOf(correo.getIdCorreo()));
}

// 3. Ahora sí eliminar el cliente
serviciosCliente.eliminarPorId("12345678");  // ✅ OK
```

**Solución 2: Usar CASCADE DELETE (no recomendado en este caso)**

```sql
-- Modificar la FK para eliminar en cascada
ALTER TABLE correo
DROP FOREIGN KEY correo_ibfk_1;

ALTER TABLE correo
ADD CONSTRAINT correo_ibfk_1
FOREIGN KEY (cliente06DNIfk) REFERENCES cliente(DNI)
ON DELETE CASCADE;  -- Elimina correos automáticamente

-- Ahora al eliminar el cliente, se eliminan sus correos
DELETE FROM cliente WHERE DNI = '12345678';  -- Elimina cliente y correos
```

---

## Acciones de Integridad Referencial

### ON DELETE (Qué hacer al eliminar el padre)

| Acción      | Comportamiento                                       | Ejemplo                                  |
| ----------- | ---------------------------------------------------- | ---------------------------------------- |
| RESTRICT    | **No permite** eliminar si tiene hijos (por defecto) | No eliminar cliente con correos          |
| CASCADE     | Elimina automáticamente los hijos                    | Eliminar cliente → elimina sus correos   |
| SET NULL    | Establece la FK en NULL                              | Eliminar cliente → correos quedan sin FK |
| SET DEFAULT | Establece la FK en un valor por defecto              | Eliminar cliente → FK = valor default    |
| NO ACTION   | Similar a RESTRICT                                   | No permite la eliminación                |

### ON UPDATE (Qué hacer al actualizar la PK del padre)

| Acción      | Comportamiento                                | Ejemplo                               |
| ----------- | --------------------------------------------- | ------------------------------------- |
| RESTRICT    | No permite actualizar si tiene hijos          | No cambiar DNI si tiene correos       |
| CASCADE     | Actualiza automáticamente las FK de los hijos | Cambiar DNI → actualiza FK en correos |
| SET NULL    | Establece la FK en NULL                       | Cambiar DNI → correos quedan sin FK   |
| SET DEFAULT | Establece la FK en un valor por defecto       | Cambiar DNI → FK = valor default      |
| NO ACTION   | Similar a RESTRICT                            | No permite la actualización           |

---

## Configuración en MySQL

### Ver la configuración actual:

```sql
SHOW CREATE TABLE correo;
```

**Resultado:**

```sql
CONSTRAINT `correo_ibfk_1`
FOREIGN KEY (`cliente06DNIfk`) REFERENCES `cliente` (`DNI`)
-- Por defecto: ON DELETE RESTRICT ON UPDATE RESTRICT
```

### Modificar el comportamiento:

```sql
-- Eliminar la FK existente
ALTER TABLE correo DROP FOREIGN KEY correo_ibfk_1;

-- Recrear con CASCADE en UPDATE
ALTER TABLE correo
ADD CONSTRAINT correo_ibfk_1
FOREIGN KEY (cliente06DNIfk) REFERENCES cliente(DNI)
ON DELETE RESTRICT    -- No permite eliminar cliente con correos
ON UPDATE CASCADE;    -- Actualiza FK si cambia el DNI
```

---

## Manejo de Excepciones en el Código

### GlobalExceptionHandler.java:

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    // Manejar violaciones de integridad referencial
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<String> handleConstraintViolation(
            org.hibernate.exception.ConstraintViolationException ex) {

        return new ResponseEntity<>(
            "Error de violación de restricción: (clave primaria, foránea) " +
            ex.getMessage(),
            HttpStatus.BAD_REQUEST
        );
    }
}
```

**Uso:**

```java
try {
    serviciosCliente.eliminarPorId("12345678");
} catch (Exception e) {
    // El GlobalExceptionHandler captura la excepción
    // y devuelve un mensaje amigable al usuario
}
```

---

## Verificación de Integridad

### Consulta para verificar correos huérfanos:

```sql
-- Buscar correos sin cliente (no debería haber ninguno)
SELECT * FROM correo
WHERE cliente06DNIfk NOT IN (SELECT DNI FROM cliente);
```

**Resultado esperado:** 0 registros (gracias a la integridad referencial)

### Consulta para verificar clientes sin correos:

```sql
-- Buscar clientes sin correos (esto sí es válido)
SELECT c.* FROM cliente c
LEFT JOIN correo co ON c.DNI = co.cliente06DNIfk
WHERE co.idCorreo IS NULL;
```

---

## Ventajas de la Integridad Referencial

✅ **Consistencia**: Los datos siempre son coherentes  
✅ **Prevención de errores**: Evita datos huérfanos  
✅ **Validación automática**: La BD valida las relaciones  
✅ **Confiabilidad**: Garantiza la calidad de los datos  
✅ **Mantenimiento**: Facilita la gestión de datos relacionados

---

## Desventajas y Consideraciones

⚠️ **Rendimiento**: Las validaciones pueden ser costosas  
⚠️ **Complejidad**: Requiere planificación cuidadosa  
⚠️ **Rigidez**: Puede dificultar ciertas operaciones  
⚠️ **Cascadas peligrosas**: CASCADE DELETE puede eliminar muchos datos

---

## Ejemplo Completo: Flujo con Integridad

### 1. Crear Cliente:

```java
Cliente06 cliente = new Cliente06("12345678", "Juan", "Pérez");
serviciosCliente.guardar(cliente);  // ✅ OK
```

**SQL:**

```sql
INSERT INTO cliente (DNI, Nombre, Apellido)
VALUES ('12345678', 'Juan', 'Pérez');
```

### 2. Crear Correo (con cliente válido):

```java
Correo06 correo = new Correo06();
correo.setCliente06(cliente);  // FK válida
correo.setCorreo("juan@gmail.com");
serviciosCorreo.guardar(correo);  // ✅ OK
```

**SQL:**

```sql
-- Hibernate verifica que el cliente existe
SELECT * FROM cliente WHERE DNI = '12345678';  -- ✅ Existe

-- Inserta el correo
INSERT INTO correo (correo, cliente06DNIfk)
VALUES ('juan@gmail.com', '12345678');  -- ✅ OK
```

### 3. Intentar eliminar cliente:

```java
serviciosCliente.eliminarPorId("12345678");  // ❌ ERROR
```

**SQL:**

```sql
DELETE FROM cliente WHERE DNI = '12345678';
-- ❌ ERROR: Cannot delete or update a parent row
```

### 4. Eliminar correctamente:

```java
// Primero eliminar correos
List<Correo06> correos = serviciosCorreo.listarPorDni("12345678");
for (Correo06 c : correos) {
    serviciosCorreo.eliminarPorId(String.valueOf(c.getIdCorreo()));
}

// Luego eliminar cliente
serviciosCliente.eliminarPorId("12345678");  // ✅ OK
```

**SQL:**

```sql
-- 1. Eliminar correos
DELETE FROM correo WHERE cliente06DNIfk = '12345678';  -- ✅ OK

-- 2. Eliminar cliente
DELETE FROM cliente WHERE DNI = '12345678';  -- ✅ OK
```

---

## Diagrama de Flujo de Validación

```
┌─────────────────────────────────────┐
│ Intentar insertar/actualizar correo │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ ¿Existe el cliente (FK válida)?     │
└──────────┬──────────────────────┬───┘
           │ SÍ                   │ NO
           ▼                      ▼
┌──────────────────────┐  ┌──────────────────────┐
│ Operación permitida  │  │ ERROR: Violación de  │
│ ✅ Guardar correo    │  │ integridad referencial│
└──────────────────────┘  └──────────────────────┘
```

---

## Comandos útiles para verificar integridad

### Ver todas las FK de la base de datos:

```sql
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_NAME IS NOT NULL
  AND TABLE_SCHEMA = 'clientecorreo';
```

### Verificar integridad manualmente:

```sql
-- Verificar que todas las FK apuntan a registros existentes
SELECT c.idCorreo, c.cliente06DNIfk
FROM correo c
LEFT JOIN cliente cl ON c.cliente06DNIfk = cl.DNI
WHERE cl.DNI IS NULL;
-- Resultado esperado: 0 registros
```

---

## Resumen

- La **integridad referencial** garantiza relaciones válidas
- Previene **datos huérfanos** (correos sin cliente)
- Se implementa mediante **claves foráneas**
- **RESTRICT** evita eliminar padres con hijos
- **CASCADE** propaga operaciones automáticamente
- La **validación** puede hacerse en código o en BD
- Es fundamental para la **consistencia** de los datos
- Requiere **planificación** cuidadosa de las operaciones
