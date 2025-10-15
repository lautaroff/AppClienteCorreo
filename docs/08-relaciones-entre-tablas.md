# Relaciones entre Tablas

## ¿Qué es una Relación entre Tablas?

Una **Relación** es una asociación lógica entre dos o más tablas basada en columnas comunes (claves primarias y foráneas). Las relaciones permiten organizar y conectar datos de manera eficiente.

---

## Relación en nuestro proyecto: Cliente ↔ Correo

### Tipo de relación: Uno a Muchos (1:N)

```
┌─────────────────┐              ┌─────────────────┐
│    CLIENTE      │ 1          N │     CORREO      │
│                 │──────────────│                 │
│  DNI (PK)       │              │  idCorreo (PK)  │
│  Nombre         │              │  correo         │
│  Apellido       │              │  cliente06DNIfk │
└─────────────────┘              └─────────────────┘
```

**Significado:**
- Un cliente puede tener **muchos** correos
- Un correo pertenece a **un solo** cliente

---

## Código Java de la Relación

### Lado "Muchos" (Correo06.java):

```java
@Entity
@Table(name = "correo")
public class Correo06 {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCorreo;
    
    @Column(name = "correo", length = 100, unique=true, nullable=false)
    private String correo;
    
    // ↓ RELACIÓN MUCHOS A UNO ↓
    @JoinColumn(name = "cliente06DNIfk", referencedColumnName = "dni", nullable=false)
    @ManyToOne(fetch = FetchType.EAGER, cascade={CascadeType.ALL})
    private Cliente06 cliente06;  // Un correo pertenece a UN cliente
}
```

### Lado "Uno" (Cliente06.java):

```java
@Entity
@Table(name = "cliente")
public class Cliente06 {
    
    @Id
    @Column(name="DNI", nullable=false, length=10)
    private String dni;
    
    @Column(name="Nombre", nullable=false, length=50)
    private String nombre;
    
    @Column(name="Apellido", nullable=false, length=50)
    private String apellido;
    
    // Nota: No hay una colección de correos aquí
    // La relación se navega desde Correo hacia Cliente
}
```

---

## Tipos de Relaciones

### 1. Uno a Muchos (1:N) - Usado en nuestro proyecto

**Ejemplo:** Un cliente tiene muchos correos

```
Cliente (1) ──────< Correo (N)
```

**Código:**
```java
// En la clase Correo (lado "muchos")
@ManyToOne
private Cliente06 cliente06;
```

**Casos de uso:**
- Un cliente → muchos correos
- Un autor → muchos libros
- Una categoría → muchos productos

---

### 2. Muchos a Uno (N:1)

**Es la misma relación vista desde el otro lado**

```
Correo (N) >────── Cliente (1)
```

**Código:**
```java
// En la clase Correo
@ManyToOne
private Cliente06 cliente06;
```

---

### 3. Uno a Uno (1:1)

**Ejemplo:** Un cliente tiene un solo correo (si fuera el caso)

```
Cliente (1) ────── Correo (1)
```

**Código (si fuera 1:1):**
```java
// En la clase Correo
@OneToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "cliente06DNIfk", referencedColumnName = "dni")
private Cliente06 cliente06;
```

**Casos de uso:**
- Una persona → un pasaporte
- Un usuario → un perfil
- Un empleado → una credencial

---

### 4. Muchos a Muchos (N:M)

**Ejemplo:** Estudiantes y Cursos

```
Estudiante (N) ><──── Curso (M)
```

**Requiere una tabla intermedia:**

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│ Estudiante  │     │ Estudiante_Curso │     │   Curso     │
├─────────────┤     ├──────────────────┤     ├─────────────┤
│ id (PK)     │<────│ estudiante_id(FK)│     │ id (PK)     │
│ nombre      │     │ curso_id (FK)    │────>│ nombre      │
└─────────────┘     └──────────────────┘     └─────────────┘
```

**Código:**
```java
// En la clase Estudiante
@ManyToMany
@JoinTable(
    name = "estudiante_curso",
    joinColumns = @JoinColumn(name = "estudiante_id"),
    inverseJoinColumns = @JoinColumn(name = "curso_id")
)
private List<Curso> cursos;
```

---

## Visualización de la Relación 1:N en nuestro proyecto

### Con datos reales:

```
CLIENTE (Tabla Padre - Lado "1"):
┌────────────┬──────────┬────────────┐
│    DNI     │  Nombre  │  Apellido  │
├────────────┼──────────┼────────────┤
│ 12345678   │ Juan     │ Pérez      │ ◄───┐
│ 87654321   │ María    │ González   │ ◄─┐ │
│ 43152355   │ Lauti    │ Ferreyra   │ ◄─┼─┼─┐
└────────────┴──────────┴────────────┘   │ │ │
                                          │ │ │
CORREO (Tabla Hija - Lado "N"):           │ │ │
┌───────────┬──────────────────────────┬─────────────────┐
│ idCorreo  │        correo            │ cliente06DNIfk  │
├───────────┼──────────────────────────┼─────────────────┤
│     1     │ juan@gmail.com           │   12345678   ───┘ │
│     2     │ juan.perez@hotmail.com   │   12345678   ─────┘
│     3     │ maria@gmail.com          │   87654321   ───┐
│     4     │ maria.g@yahoo.com        │   87654321   ───┘
│     5     │ lauferreyraff@gmail.com  │   43152355   ─────┘
└───────────┴──────────────────────────┴─────────────────┘

Interpretación:
- Juan (12345678) tiene 2 correos
- María (87654321) tiene 2 correos
- Lauti (43152355) tiene 1 correo
```

---

## Navegación de la Relación en el Código

### De Correo a Cliente (Muchos → Uno):

```java
// Obtener un correo
Correo06 correo = serviciosCorreo.buscarPorId("1");

// Navegar a su cliente relacionado
Cliente06 cliente = correo.getCliente06();

System.out.println("Correo: " + correo.getCorreo());
System.out.println("Pertenece a: " + cliente.getNombre() + " " + cliente.getApellido());
```

**Salida:**
```
Correo: juan@gmail.com
Pertenece a: Juan Pérez
```

### De Cliente a Correos (Uno → Muchos):

```java
// Obtener todos los correos de un cliente
@Override
public List<Correo06> listarPorDni(String dni) {
    return correosRepositorio.findAll().stream()
        .filter(correo -> correo.getCliente06() != null && 
                         correo.getCliente06().getDni().equals(dni))
        .toList();
}
```

**Uso:**
```java
List<Correo06> correosDeJuan = serviciosCorreo.listarPorDni("12345678");
System.out.println("Juan tiene " + correosDeJuan.size() + " correos");
```

---

## Consultas SQL con Relaciones

### INNER JOIN - Mostrar correos con sus clientes:

```sql
SELECT 
    c.idCorreo,
    c.correo,
    cl.DNI,
    cl.Nombre,
    cl.Apellido
FROM correo c
INNER JOIN cliente cl ON c.cliente06DNIfk = cl.DNI;
```

**Resultado:**
```
+----------+-------------------------+----------+---------+-----------+
| idCorreo | correo                  | DNI      | Nombre  | Apellido  |
+----------+-------------------------+----------+---------+-----------+
|    1     | juan@gmail.com          | 12345678 | Juan    | Pérez     |
|    2     | juan.perez@hotmail.com  | 12345678 | Juan    | Pérez     |
|    3     | maria@gmail.com         | 87654321 | María   | González  |
|    4     | lauferreyraff@gmail.com | 43152355 | Lauti   | Ferreyra  |
+----------+-------------------------+----------+---------+-----------+
```

### LEFT JOIN - Mostrar todos los clientes, tengan o no correos:

```sql
SELECT 
    cl.DNI,
    cl.Nombre,
    cl.Apellido,
    COUNT(c.idCorreo) as CantidadCorreos
FROM cliente cl
LEFT JOIN correo c ON cl.DNI = c.cliente06DNIfk
GROUP BY cl.DNI, cl.Nombre, cl.Apellido;
```

**Resultado:**
```
+----------+---------+-----------+-----------------+
| DNI      | Nombre  | Apellido  | CantidadCorreos |
+----------+---------+-----------+-----------------+
| 12345678 | Juan    | Pérez     |       2         |
| 87654321 | María   | González  |       1         |
| 43152355 | Lauti   | Ferreyra  |       1         |
| 99999999 | Pedro   | López     |       0         | ← Sin correos
+----------+---------+-----------+-----------------+
```

---

## Implementación en el Servicio

### Listar correos con información del cliente:

```java
@Override
public List<Correo06> listarCorreosConClientes() {
    return correosRepositorio.findAll().stream()
        .filter(correo -> correo.getCliente06() != null)
        .toList();
}
```

### Listar correos de un cliente específico:

```java
@Override
public List<Correo06> listarCorreosConClientesPorDni(String dni) {
    return correosRepositorio.findAll().stream()
        .filter(correo -> correo.getCliente06() != null && 
                         correo.getCliente06().getDni().equals(dni))
        .toList();
}
```

---

## Cardinalidad de la Relación

### Notación:

```
Cliente (1,1) ──────< (0,N) Correo
```

**Interpretación:**
- **(1,1)**: Un cliente existe por sí mismo (mínimo 1, máximo 1)
- **(0,N)**: Un cliente puede tener 0 o muchos correos
  - **0**: Un cliente puede no tener correos
  - **N**: Un cliente puede tener muchos correos

---

## Operaciones en Cascada

### CascadeType.ALL en nuestro proyecto:

```java
@ManyToOne(fetch = FetchType.EAGER, cascade={CascadeType.ALL})
private Cliente06 cliente06;
```

**Comportamiento:**
- Al guardar un correo, se guarda el cliente si es nuevo
- Al actualizar un correo, se actualiza el cliente
- ⚠️ Al eliminar un correo, se eliminaría el cliente (cuidado)

### Ejemplo de propagación:

```java
// Crear un nuevo cliente y correo en una sola operación
Cliente06 nuevoCliente = new Cliente06("11111111", "Ana", "Martínez");
Correo06 nuevoCorreo = new Correo06();
nuevoCorreo.setCliente06(nuevoCliente);  // Cliente aún no guardado
nuevoCorreo.setCorreo("ana@gmail.com");

// Al guardar el correo, se guarda automáticamente el cliente
serviciosCorreo.guardar(nuevoCorreo);  // Guarda ambos
```

---

## Ventajas de las Relaciones

✅ **Normalización**: Evita duplicación de datos  
✅ **Integridad**: Mantiene consistencia entre tablas  
✅ **Eficiencia**: Consultas optimizadas con JOIN  
✅ **Mantenimiento**: Cambios en un lugar se reflejan en todos  
✅ **Escalabilidad**: Fácil agregar más relaciones  

---

## Ejemplo completo: Crear Cliente con Correos

```java
// 1. Crear el cliente
Cliente06 cliente = new Cliente06();
cliente.setDni("55555555");
cliente.setNombre("Carlos");
cliente.setApellido("Rodríguez");
serviciosCliente.guardar(cliente);

// 2. Crear primer correo
Correo06 correo1 = new Correo06();
correo1.setCliente06(cliente);  // Establecer relación
correo1.setCorreo("carlos@gmail.com");
serviciosCorreo.guardar(correo1);

// 3. Crear segundo correo
Correo06 correo2 = new Correo06();
correo2.setCliente06(cliente);  // Misma relación
correo2.setCorreo("carlos.rodriguez@hotmail.com");
serviciosCorreo.guardar(correo2);

// Resultado: 1 cliente con 2 correos relacionados
```

---

## Diagrama Entidad-Relación (ER)

```
┌─────────────────────────────────────┐
│           CLIENTE                   │
├─────────────────────────────────────┤
│ PK  DNI          VARCHAR(10)        │
│     Nombre       VARCHAR(50)        │
│     Apellido     VARCHAR(50)        │
└──────────────┬──────────────────────┘
               │
               │ tiene
               │ 1:N
               │
┌──────────────▼──────────────────────┐
│           CORREO                    │
├─────────────────────────────────────┤
│ PK  idCorreo         INT            │
│     correo           VARCHAR(100)   │
│ FK  cliente06DNIfk   VARCHAR(10)    │
└─────────────────────────────────────┘
```

---

## Resumen

- Las **relaciones** conectan tablas mediante claves
- **1:N** (Uno a Muchos) es la más común
- Se implementa con **`@ManyToOne`** en JPA
- La **clave foránea** establece la relación física
- Permite **navegar** entre objetos relacionados
- **Cascade** controla la propagación de operaciones
- **JOIN** en SQL combina datos de tablas relacionadas
- Fundamental para la **normalización** de bases de datos
