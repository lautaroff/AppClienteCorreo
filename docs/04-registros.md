# Registros

## ¿Qué es un Registro?

Un **Registro** (también llamado **fila** o **tupla**) es cada una de las entradas individuales en una tabla. Representa una instancia completa de los datos que la tabla almacena.

---

## Registros en la Tabla CLIENTE

### Ejemplo visual:

```
┌────────────┬──────────┬────────────┐
│    DNI     │  Nombre  │  Apellido  │  ← Columnas
├────────────┼──────────┼────────────┤
│ 12345678   │ Juan     │ Pérez      │  ← Registro 1
│ 87654321   │ María    │ González   │  ← Registro 2
│ 43152355   │ Lauti    │ Ferreyra   │  ← Registro 3
└────────────┴──────────┴────────────┘
```

Cada fila horizontal es un **registro** que contiene información completa de un cliente.



---

## Operaciones CRUD sobre Registros

### CREATE - Crear un Registro

#### En el Controlador

**Archivo:** `src/main/java/app/controladores/ClienteControlador.java` (líneas 33-62)

```java
@GetMapping("/guardar/{dni}/{nombre}/{apellido}")
public String guardar(@PathVariable("dni") String dni, 
                      @PathVariable("nombre") String nombre,
                      @PathVariable("apellido") String apellido) {
    
    // 1. Crear un nuevo objeto Cliente06 (representa un registro)
    clienteNuevo = new Cliente06();
    clienteNuevo.setDni(dni);
    clienteNuevo.setNombre(nombre);
    clienteNuevo.setApellido(apellido);
    
    // 2. Guardar el registro en la base de datos
    serviciosCliente.guardar(clienteNuevo);
    
    return "Cliente agregado correctamente";
}
```

#### En el Servicio

**Archivo:** `src/main/java/app/servicios/ServiciosCliente.java` (líneas 30-32)

```java
@Override
public void guardar(Cliente06 cliente) {
    clientesRepositorio.save(cliente);
}
```

#### SQL generado por Hibernate:

```sql
INSERT INTO cliente (DNI, Nombre, Apellido) 
VALUES ('43152355', 'Lauti', 'Ferreyra');
```

---

### READ - Leer Registros

#### Listar todos los registros

**Archivo:** `src/main/java/app/controladores/ClienteControlador.java` (líneas 64-73)

```java
@GetMapping("/listartodos")
public List<Cliente06> listarTodos() {
    List<Cliente06> respuesta = serviciosCliente.listarTodos();
    return respuesta;
}
```

#### En el Servicio

**Archivo:** `src/main/java/app/servicios/ServiciosCliente.java` (líneas 20-22)

```java
@Override
public List<Cliente06> listarTodos() {
    return clientesRepositorio.findAll();
}
```

#### SQL generado:

```sql
SELECT * FROM cliente;
```

#### Buscar un registro por ID

**Archivo:** `src/main/java/app/controladores/ClienteControlador.java` (líneas 75-93)

```java
@GetMapping("/buscarpordni")
public Cliente06 buscarPorId(@RequestParam(value = "dni") String dni) {
    Cliente06 cliente = serviciosCliente.buscarPorId(dni);
    return cliente;
}
```

#### SQL generado:

```sql
SELECT * FROM cliente WHERE DNI = '43152355';
```

---

### UPDATE - Actualizar un Registro

**Archivo:** `src/main/java/app/controladores/ClienteControlador.java` (líneas 95-117)

```java
@PostMapping("/actualizar/{dni}/{nombre}/{apellido}")
public String actualizar(@PathVariable("dni") String dni, 
                        @PathVariable("nombre") String nombre,
                        @PathVariable("apellido") String apellido) {
    
    // 1. Buscar el registro existente
    Cliente06 clienteExistente = serviciosCliente.buscarPorId(dni);
    
    if (clienteExistente != null) {
        // 2. Modificar los campos del registro
        clienteExistente.setNombre(nombre);
        clienteExistente.setApellido(apellido);
        
        // 3. Guardar los cambios
        serviciosCliente.guardar(clienteExistente);
        return "Cliente actualizado correctamente";
    }
    return "Cliente no encontrado";
}
```

#### SQL generado:

```sql
UPDATE cliente 
SET Nombre = 'Juan Carlos', Apellido = 'Pérez García' 
WHERE DNI = '12345678';
```

---

### DELETE - Eliminar un Registro

**Archivo:** `src/main/java/app/controladores/ClienteControlador.java` (líneas 119-135)

```java
@DeleteMapping("/borrar/{dni}")
public String eliminarPorId(@PathVariable("dni") String dni) {
    Cliente06 clienteExistente = serviciosCliente.buscarPorId(dni);
    
    if (clienteExistente != null) {
        serviciosCliente.eliminarPorId(dni);
        return "Cliente eliminado correctamente";
    }
    return "Cliente no encontrado";
}
```

#### En el Servicio

**Archivo:** `src/main/java/app/servicios/ServiciosCliente.java` (líneas 33-35)

```java
@Override
public void eliminarPorId(String dni) {
    clientesRepositorio.deleteById(dni);
}
```

#### SQL generado:

```sql
DELETE FROM cliente WHERE DNI = '12345678';
```

---

## Registros en la Tabla CORREO

### Ejemplo visual:

```
┌───────────┬──────────────────────────┬─────────────────┐
│ idCorreo  │        correo            │ cliente06DNIfk  │
├───────────┼──────────────────────────┼─────────────────┤
│     1     │ juan@gmail.com           │   12345678      │  ← Registro 1
│     2     │ juan.perez@hotmail.com   │   12345678      │  ← Registro 2
│     3     │ maria@gmail.com          │   87654321      │  ← Registro 3
│     4     │ lauferreyraff@gmail.com  │   43152355      │  ← Registro 4
└───────────┴──────────────────────────┴─────────────────┘
```

### Crear un registro de correo

**Archivo:** `src/main/java/app/controladores/CorreoControlador.java` (líneas 38-58)

```java
@GetMapping("/guardar/{dni}/{correo}")
public String guardar(@PathVariable("dni") String dni, 
                     @PathVariable("correo") String correo) {
    
    // 1. Buscar el cliente asociado
    cliente = serviciosCliente.buscarPorId(dni);
    
    if (cliente == null) {
        return "No existe un cliente con el DNI: " + dni;
    }
    
    // 2. Crear el nuevo registro de correo
    correoNuevo = new Correo06();
    correoNuevo.setCliente06(cliente);  // Asociar con el cliente
    correoNuevo.setCorreo(correo);
    
    // 3. Guardar el registro
    serviciosCorreo.guardar(correoNuevo);
    
    return "Correo agregado correctamente";
}
```

#### SQL generado:

```sql
INSERT INTO correo (correo, cliente06DNIfk) 
VALUES ('lauferreyraff@gmail.com', '43152355');
```

---

## Relación entre Objetos Java y Registros SQL

```
Objeto Java (Cliente06)  →  Registro en tabla cliente
Objeto Java (Correo06)   →  Registro en tabla correo
```

### Ejemplo de conversión:

**Código Java:**
```java
Cliente06 cliente = new Cliente06();
cliente.setDni("12345678");
cliente.setNombre("Juan");
cliente.setApellido("Pérez");
```

**Se convierte en SQL:**
```sql
INSERT INTO cliente (DNI, Nombre, Apellido) 
VALUES ('12345678', 'Juan', 'Pérez');
```

---

## Arquitectura de Capas para Manejo de Registros

```
┌─────────────────────────────────────────┐
│  CONTROLADOR (ClienteControlador.java)  │
│  - Recibe peticiones HTTP                │
│  - Valida datos de entrada               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  SERVICIO (ServiciosCliente.java)       │
│  - Lógica de negocio                     │
│  - Coordina operaciones                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  REPOSITORIO (ClientesRepositorio.java) │
│  - Acceso directo a la base de datos    │
│  - Métodos CRUD automáticos (JPA)       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  BASE DE DATOS (MySQL)                   │
│  - Almacenamiento físico de registros   │
└─────────────────────────────────────────┘
```

---

## Consultas SQL para Registros

### Ver todos los registros:

```sql
SELECT * FROM cliente;
SELECT * FROM correo;
```

### Contar registros:

```sql
SELECT COUNT(*) FROM cliente;
SELECT COUNT(*) FROM correo;
```

### Buscar registros específicos:

```sql
-- Buscar cliente por DNI
SELECT * FROM cliente WHERE DNI = '43152355';

-- Buscar correos de un cliente
SELECT * FROM correo WHERE cliente06DNIfk = '43152355';

-- Buscar correo específico
SELECT * FROM correo WHERE correo = 'lauferreyraff@gmail.com';
```

### Consultas con JOIN (relacionando registros):

```sql
-- Ver todos los correos con información del cliente
SELECT c.idCorreo, c.correo, cl.DNI, cl.Nombre, cl.Apellido
FROM correo c
INNER JOIN cliente cl ON c.cliente06DNIfk = cl.DNI;
```

---

## Características importantes de los Registros

✅ **Unicidad**: Cada registro debe ser único (identificado por su clave primaria)  
✅ **Integridad**: Los datos deben ser consistentes y válidos  
✅ **Atomicidad**: Un registro es la unidad mínima de información completa  
✅ **Persistencia**: Los registros se mantienen en la base de datos  
✅ **Relaciones**: Los registros pueden estar relacionados entre tablas  

---

## Validaciones en el Código

### Verificar si existe un registro:

```java
Cliente06 clienteExistente = serviciosCliente.buscarPorId(dni);
if (clienteExistente != null) {
    return "Existe un cliente con ese DNI";
}
```

### Evitar duplicados:

```java
if (serviciosCliente.existePorId(dni)) {
    return "Ya existe un cliente con ese DNI";
}
```

---

## Resumen

- Un **registro** es una fila completa en una tabla
- Cada registro contiene valores para todas las columnas definidas
- Los registros se manipulan mediante operaciones **CRUD**
- En Java, un registro se representa como un **objeto** de una clase entidad
- **JPA/Hibernate** convierte automáticamente entre objetos Java y registros SQL
- Los registros están relacionados mediante **claves foráneas**
