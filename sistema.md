# Sistema de Gestión y Recomendación de Películas

## 📋 Descripción General

Sistema web de gestión de películas que permite a usuarios administradores gestionar el catálogo de películas, mientras que los clientes pueden explorar, comentar y valorar las películas disponibles.

## 🏗️ Arquitectura del Sistema

### Tecnologías Utilizadas
- **Backend**: Java (Programación Orientada a Objetos)
- **Frontend**: HTML5, CSS3
- **Manipulación del DOM**: JavaScript integrado con Java

### Paradigma de Programación
- **Programación Orientada a Objetos (POO)**
- Uso de clases, herencia, encapsulamiento y polimorfismo
- Manipulación del DOM para interacción dinámica con el usuario

---

## 🗂️ Modelo de Datos (Clases)

### 1. Clase `Usuario`
```java
class Usuario {
    - nombre: String
    - esAdmin: boolean
    - email: String
    - password: String
    
    + registrarse(nombre, email, password, esAdmin): void
    + iniciarSesion(email, password): boolean
    + darMeGusta(pelicula: Pelicula): void
    + comentar(pelicula: Pelicula, texto: String): void
}
```

### 2. Clase `Pelicula`
```java
class Pelicula {
    - nombre: String
    - director: String
    - año: int
    - sinopsis: String
    - categoria: Categoria
    - likes: int
    - comentarios: ArrayList<Comentario>
    
    + Pelicula(nombre, director, año, sinopsis, categoria)
    + darMeGusta(): void
    + agregarComentario(comentario: Comentario): void
    + actualizarDatos(nombre, director, año, sinopsis, categoria): void
}
```

### 3. Clase `Categoria`
```java
class Categoria {
    - nombre: String
    - descripcion: String
    
    + Categoria(nombre, descripcion)
}
```

### 4. Clase `Comentario`
```java
class Comentario {
    - usuario: String
    - texto: String
    - fecha: String
    - id: int
    
    + Comentario(usuario, texto, fecha)
    + actualizarTexto(nuevoTexto: String): void
}
```

### 5. Clase `SistemaRecomendador`
```java
class SistemaRecomendador {
    - peliculas: ArrayList<Pelicula>
    - categorias: ArrayList<Categoria>
    - usuarios: ArrayList<Usuario>
    
    + agregarPelicula(pelicula: Pelicula): void
    + agregarCategoria(categoria: Categoria): void
    + listarPeliculas(): ArrayList<Pelicula>
    + listarCategorias(): ArrayList<Categoria>
    + eliminarPelicula(pelicula: Pelicula): void
    + validarUsuario(email, password): Usuario
}
```

---

## 👥 Tipos de Usuario

### Usuario Administrador
**Privilegios:**
- ✅ Crear nuevas películas
- ✅ Actualizar información de películas existentes
- ✅ Eliminar películas del catálogo
- ✅ Gestionar categorías
- ✅ Ver todas las películas
- ✅ Ver comentarios y likes

### Usuario Cliente
**Privilegios:**
- ✅ Ver catálogo de películas
- ✅ Dar "like" a películas
- ✅ Comentar películas
- ✅ Actualizar sus propios comentarios
- ✅ Eliminar sus propios comentarios
- ❌ NO puede crear, actualizar o eliminar películas

---

## 🔐 Flujo de Autenticación

### 1. Crear Cuenta (Registro)

#### Pantalla de Registro
```
┌─────────────────────────────────────┐
│      REGISTRO DE USUARIO            │
├─────────────────────────────────────┤
│ Nombre:     [________________]      │
│ Email:      [________________]      │
│ Contraseña: [________________]      │
│                                     │
│ Tipo de cuenta:                     │
│  ○ Cliente                          │
│  ○ Administrador                    │
│                                     │
│  [  Registrarse  ] [  Cancelar  ]  │
└─────────────────────────────────────┘
```

#### Proceso de Registro
1. **Usuario ingresa datos:**
   - Nombre completo
   - Email (debe ser único)
   - Contraseña (mínimo 6 caracteres)
   - Selección de tipo de cuenta

2. **Validaciones:**
   - Verificar que el email no esté registrado
   - Validar formato de email
   - Validar longitud de contraseña
   - Todos los campos son obligatorios

3. **Creación de cuenta:**
   ```java
   Usuario nuevoUsuario = new Usuario();
   nuevoUsuario.registrarse(nombre, email, password, esAdmin);
   sistema.agregarUsuario(nuevoUsuario);
   ```

4. **Resultado:**
   - ✅ Cuenta creada exitosamente → Redirigir a inicio de sesión
   - ❌ Error → Mostrar mensaje de error específico

---

### 2. Iniciar Sesión

#### Pantalla de Inicio de Sesión
```
┌─────────────────────────────────────┐
│      INICIAR SESIÓN                 │
├─────────────────────────────────────┤
│ Email:      [________________]      │
│ Contraseña: [________________]      │
│                                     │
│  [  Iniciar Sesión  ]              │
│                                     │
│  ¿No tienes cuenta? [Regístrate]   │
└─────────────────────────────────────┘
```

#### Proceso de Inicio de Sesión
1. **Usuario ingresa credenciales:**
   - Email
   - Contraseña

2. **Validación:**
   ```java
   Usuario usuario = sistema.validarUsuario(email, password);
   if (usuario != null) {
       // Credenciales válidas
       sesionActual = usuario;
   } else {
       // Credenciales inválidas
       mostrarError("Email o contraseña incorrectos");
   }
   ```

3. **Validación de tipo de usuario:**
   ```java
   if (usuario.esAdmin) {
       // Redirigir a panel de administrador
       cargarPanelAdmin();
   } else {
       // Redirigir a panel de cliente
       cargarPanelCliente();
   }
   ```

4. **Resultado:**
   - ✅ Credenciales correctas → Redirigir según tipo de usuario
   - ❌ Credenciales incorrectas → Mostrar mensaje de error

---

## 🎬 Funcionalidades por Tipo de Usuario

### Panel de Administrador

#### 1. Crear Película

**Interfaz:**
```
┌─────────────────────────────────────────┐
│   CREAR NUEVA PELÍCULA                  │
├─────────────────────────────────────────┤
│ Nombre:      [____________________]     │
│ Director:    [____________________]     │
│ Año:         [____]                     │
│ Categoría:   [▼ Seleccionar categoría] │
│ Sinopsis:    [____________________]     │
│              [____________________]     │
│              [____________________]     │
│                                         │
│  [  Crear  ]  [  Cancelar  ]           │
└─────────────────────────────────────────┘
```

**Proceso:**
1. Admin completa formulario con datos de la película
2. Selecciona categoría desde lista desplegable
3. Sistema valida datos (campos obligatorios, año válido)
4. Se crea objeto Pelicula y se agrega al sistema
```java
Pelicula nuevaPelicula = new Pelicula(nombre, director, año, sinopsis, categoria);
sistema.agregarPelicula(nuevaPelicula);
```
5. DOM se actualiza para mostrar la nueva película en la lista

---

#### 2. Actualizar Película

**Interfaz:**
```
┌─────────────────────────────────────────┐
│   LISTA DE PELÍCULAS                    │
├─────────────────────────────────────────┤
│                                         │
│ □ The Shawshank Redemption              │
│   Director: Frank Darabont              │
│   [Editar] [Eliminar]                   │
│                                         │
│ □ The Godfather                         │
│   Director: Francis Ford Coppola        │
│   [Editar] [Eliminar]                   │
│                                         │
└─────────────────────────────────────────┘
```

**Proceso al hacer clic en "Editar":**
1. Se abre formulario prellenado con datos actuales
2. Admin modifica los campos deseados
3. Sistema valida los nuevos datos
4. Se actualiza el objeto Pelicula
```java
pelicula.actualizarDatos(nuevoNombre, nuevoDirector, nuevoAño, nuevaSinopsis, nuevaCategoria);
```
5. DOM se actualiza para reflejar los cambios

---

#### 3. Eliminar Película

**Proceso:**
1. Admin hace clic en botón "Eliminar"
2. Sistema muestra confirmación:
```
┌─────────────────────────────────────┐
│   ⚠️  CONFIRMAR ELIMINACIÓN         │
├─────────────────────────────────────┤
│ ¿Estás seguro de eliminar           │
│ "The Shawshank Redemption"?         │
│                                     │
│ Esta acción no se puede deshacer.  │
│                                     │
│  [  Sí, eliminar  ]  [  Cancelar  ]│
└─────────────────────────────────────┘
```
3. Si confirma, se elimina del sistema:
```java
sistema.eliminarPelicula(pelicula);
```
4. DOM se actualiza removiendo el elemento de la lista

---

### Panel de Cliente

#### 1. Ver Catálogo de Películas

**Interfaz:**
```
┌─────────────────────────────────────────┐
│   CATÁLOGO DE PELÍCULAS                 │
├─────────────────────────────────────────┤
│ Filtrar por categoría: [▼ Todas]       │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ The Shawshank Redemption        │    │
│ │ Director: Frank Darabont        │    │
│ │ Año: 1994 | Drama               │    │
│ │ ❤️ 1,234 likes                  │    │
│ │                                 │    │
│ │ [❤️ Me gusta] [💬 Ver detalles] │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ The Godfather                   │    │
│ │ Director: Francis Ford Coppola  │    │
│ │ Año: 1972 | Drama, Crimen      │    │
│ │ ❤️ 2,456 likes                  │    │
│ │                                 │    │
│ │ [❤️ Me gusta] [💬 Ver detalles] │    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Proceso:**
1. Sistema carga todas las películas:
```java
ArrayList<Pelicula> peliculas = sistema.listarPeliculas();
```
2. DOM renderiza cada película como tarjeta
3. Cliente puede filtrar por categoría
4. Actualización dinámica sin recargar página

---

#### 2. Dar "Like" a Película

**Proceso:**
1. Cliente hace clic en botón "❤️ Me gusta"
2. Sistema verifica que el usuario no haya dado like previamente
3. Se incrementa contador de likes:
```java
usuario.darMeGusta(pelicula);
pelicula.darMeGusta(); // Incrementa likes
```
4. DOM actualiza el contador visualmente
5. Botón cambia de estado (ej: color rojo, deshabilitado)

---

#### 3. Comentar Película

**Interfaz de Detalles:**
```
┌─────────────────────────────────────────┐
│   The Shawshank Redemption              │
├─────────────────────────────────────────┤
│ Director: Frank Darabont                │
│ Año: 1994                               │
│ Categoría: Drama                        │
│ ❤️ 1,234 likes                          │
│                                         │
│ Sinopsis:                               │
│ Two imprisoned men bond over a number   │
│ of years, finding solace and eventual  │
│ redemption through acts of common       │
│ decency.                                │
│                                         │
│ ── COMENTARIOS ──                       │
│                                         │
│ 💬 Agregar comentario:                  │
│ [_________________________________]     │
│ [_________________________________]     │
│  [  Publicar  ]                         │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ 👤 Juan Pérez | 2024-05-09        │  │
│ │ ¡Excelente película! Una obra     │  │
│ │ maestra del cine.                 │  │
│ │ [✏️ Editar] [🗑️ Eliminar]         │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ 👤 María López | 2024-05-08       │  │
│ │ Mi película favorita de todos los │  │
│ │ tiempos.                          │  │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Proceso para comentar:**
1. Cliente escribe comentario en campo de texto
2. Hace clic en "Publicar"
3. Sistema crea objeto Comentario:
```java
Comentario nuevoComentario = new Comentario(
    usuario.nombre, 
    textoComentario, 
    fechaActual
);
pelicula.agregarComentario(nuevoComentario);
```
4. DOM agrega el comentario a la lista sin recargar
5. Campo de texto se limpia

---

#### 4. Actualizar Comentario Propio

**Proceso:**
1. Cliente hace clic en "✏️ Editar" en su comentario
2. Comentario se convierte en campo editable:
```
┌───────────────────────────────────┐
│ 👤 Juan Pérez | 2024-05-09        │
│ [_______________________________] │
│ [_______________________________] │
│  [💾 Guardar] [❌ Cancelar]       │
└───────────────────────────────────┘
```
3. Cliente modifica el texto
4. Hace clic en "Guardar"
5. Sistema actualiza el comentario:
```java
comentario.actualizarTexto(nuevoTexto);
```
6. DOM actualiza el comentario visualmente

**Validación:**
- Solo el autor del comentario puede editarlo
- Sistema verifica: `comentario.usuario == usuarioActual.nombre`

---

#### 5. Eliminar Comentario Propio

**Proceso:**
1. Cliente hace clic en "🗑️ Eliminar"
2. Sistema muestra confirmación
3. Si confirma, elimina el comentario:
```java
pelicula.comentarios.remove(comentario);
```
4. DOM elimina el elemento del comentario

**Validación:**
- Solo el autor del comentario puede eliminarlo
- Sistema verifica: `comentario.usuario == usuarioActual.nombre`

---

## 🔄 Manipulación del DOM

### Operaciones Principales

#### 1. Renderizar Lista de Películas
```java
// Java genera el HTML dinámicamente
for (Pelicula pelicula : peliculas) {
    String html = "<div class='pelicula-card'>" +
                  "<h3>" + pelicula.getNombre() + "</h3>" +
                  "<p>Director: " + pelicula.getDirector() + "</p>" +
                  // ... más contenido
                  "</div>";
    document.getElementById("peliculas-container").innerHTML += html;
}
```

#### 2. Actualizar Contador de Likes
```java
// Actualizar sin recargar página
String elementId = "likes-" + pelicula.getId();
document.getElementById(elementId).textContent = pelicula.getLikes();
```

#### 3. Agregar Comentario Dinámicamente
```java
String comentarioHtml = "<div class='comentario'>" +
                        "<p><strong>" + comentario.getUsuario() + "</strong></p>" +
                        "<p>" + comentario.getTexto() + "</p>" +
                        "</div>";
document.getElementById("comentarios-lista").innerHTML += comentarioHtml;
```

#### 4. Eliminar Elemento del DOM
```java
Element elemento = document.getElementById("pelicula-" + peliculaId);
elemento.remove();
```

---

## 📊 Casos de Uso Detallados

### Caso de Uso 1: Registro e Inicio de Sesión de Cliente

**Actores:** Cliente nuevo

**Flujo Principal:**
1. Cliente accede a la página principal
2. Hace clic en "Registrarse"
3. Completa formulario (nombre, email, password)
4. Selecciona tipo "Cliente"
5. Sistema valida datos
6. Sistema crea cuenta
7. Cliente es redirigido a inicio de sesión
8. Ingresa credenciales
9. Sistema valida y detecta tipo "Cliente"
10. Cliente es redirigido a catálogo de películas

**Flujos Alternativos:**
- 5a. Email ya existe → Mostrar error
- 8a. Credenciales incorrectas → Mostrar error

---

### Caso de Uso 2: Administrador Crea Película

**Actores:** Administrador

**Precondiciones:** Administrador ha iniciado sesión

**Flujo Principal:**
1. Admin accede a panel de administración
2. Hace clic en "Crear Nueva Película"
3. Completa formulario con datos de película
4. Selecciona categoría existente
5. Hace clic en "Crear"
6. Sistema valida datos
7. Sistema crea objeto Pelicula
8. Sistema agrega película al catálogo
9. DOM actualiza lista de películas
10. Película aparece en catálogo para todos los usuarios

**Flujos Alternativos:**
- 6a. Datos inválidos → Mostrar errores específicos
- 6b. Película ya existe → Mostrar advertencia

---

### Caso de Uso 3: Cliente Comenta y da Like a Película

**Actores:** Cliente

**Precondiciones:** Cliente ha iniciado sesión

**Flujo Principal:**
1. Cliente navega por catálogo
2. Hace clic en "Ver detalles" de una película
3. Lee información y comentarios existentes
4. Hace clic en "❤️ Me gusta"
5. Sistema incrementa contador de likes
6. DOM actualiza visualmente el contador
7. Cliente escribe comentario en campo de texto
8. Hace clic en "Publicar"
9. Sistema crea objeto Comentario
10. Sistema agrega comentario a la película
11. DOM agrega comentario a la lista
12. Comentario aparece inmediatamente

**Flujos Alternativos:**
- 4a. Usuario ya dio like → Botón deshabilitado
- 8a. Campo vacío → Mostrar error de validación

---

### Caso de Uso 4: Cliente Actualiza su Comentario

**Actores:** Cliente

**Precondiciones:** 
- Cliente ha iniciado sesión
- Cliente tiene al menos un comentario publicado

**Flujo Principal:**
1. Cliente visualiza sus comentarios en película
2. Hace clic en "✏️ Editar" en su comentario
3. Comentario se vuelve editable
4. Cliente modifica el texto
5. Hace clic en "Guardar"
6. Sistema valida que sea el autor
7. Sistema actualiza el comentario
8. DOM actualiza el texto del comentario
9. Comentario muestra texto actualizado

**Flujos Alternativos:**
- 6a. Usuario no es autor → Operación denegada
- 5a. Campo vacío → Mostrar error

---

## 🎨 Estructura de Interfaz (HTML + CSS)

### Componentes Principales

#### 1. Barra de Navegación
```html
<nav class="navbar">
    <div class="logo">🎬 CineSystem</div>
    <div class="user-menu">
        <span id="username">Usuario</span>
        <button id="logout">Cerrar Sesión</button>
    </div>
</nav>
```

#### 2. Panel de Administrador
```html
<div class="admin-panel">
    <div class="admin-controls">
        <button class="btn-primary" id="crear-pelicula">
            ➕ Nueva Película
        </button>
        <button class="btn-secondary" id="gestionar-categorias">
            📁 Gestionar Categorías
        </button>
    </div>
    <div id="peliculas-admin-lista">
        <!-- Películas con botones editar/eliminar -->
    </div>
</div>
```

#### 3. Catálogo de Cliente
```html
<div class="catalogo">
    <div class="filtros">
        <select id="filtro-categoria">
            <option value="todas">Todas las categorías</option>
            <!-- Categorías dinámicas -->
        </select>
    </div>
    <div id="peliculas-grid">
        <!-- Tarjetas de películas -->
    </div>
</div>
```

#### 4. Tarjeta de Película
```html
<div class="pelicula-card">
    <h3 class="pelicula-titulo">Título</h3>
    <p class="pelicula-director">Director: Frank Darabont</p>
    <p class="pelicula-info">1994 | Drama</p>
    <div class="pelicula-likes">
        <span class="likes-count">❤️ 1234</span>
    </div>
    <div class="pelicula-acciones">
        <button class="btn-like">Me gusta</button>
        <button class="btn-detalles">Ver detalles</button>
    </div>
</div>
```

---

## 🔧 Implementación Técnica

### Integración Java - HTML - CSS

#### 1. Servlets para Manejo de Peticiones
```java
@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, 
                         HttpServletResponse response) {
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        
        Usuario usuario = sistema.validarUsuario(email, password);
        
        if (usuario != null) {
            request.getSession().setAttribute("usuario", usuario);
            if (usuario.esAdmin()) {
                response.sendRedirect("admin-panel.jsp");
            } else {
                response.sendRedirect("catalogo.jsp");
            }
        } else {
            request.setAttribute("error", "Credenciales inválidas");
            request.getRequestDispatcher("login.jsp").forward(request, response);
        }
    }
}
```

#### 2. JSP para Renderizado Dinámico
```jsp
<%@ page import="modelo.Pelicula, java.util.ArrayList" %>

<div id="peliculas-grid">
    <% 
    ArrayList<Pelicula> peliculas = (ArrayList<Pelicula>) 
        request.getAttribute("peliculas");
    for (Pelicula p : peliculas) {
    %>
        <div class="pelicula-card">
            <h3><%= p.getNombre() %></h3>
            <p>Director: <%= p.getDirector() %></p>
            <p><%= p.getAño() %> | <%= p.getCategoria().getNombre() %></p>
            <div class="likes">❤️ <%= p.getLikes() %></div>
            <button onclick="darLike(<%= p.getId() %>)">
                Me gusta
            </button>
        </div>
    <% } %>
</div>
```

#### 3. JavaScript para Manipulación del DOM
```javascript
function darLike(peliculaId) {
    // Petición AJAX al servidor
    fetch('/api/pelicula/' + peliculaId + '/like', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        // Actualizar DOM sin recargar
        document.getElementById('likes-' + peliculaId)
                .textContent = '❤️ ' + data.nuevosLikes;
        // Deshabilitar botón
        event.target.disabled = true;
        event.target.classList.add('liked');
    });
}

function agregarComentario(peliculaId) {
    const texto = document.getElementById('comentario-texto').value;
    
    fetch('/api/pelicula/' + peliculaId + '/comentario', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({texto: texto})
    })
    .then(response => response.json())
    .then(comentario => {
        // Agregar comentario al DOM
        const comentarioHtml = `
            <div class="comentario" id="comentario-${comentario.id}">
                <p><strong>${comentario.usuario}</strong> | ${comentario.fecha}</p>
                <p>${comentario.texto}</p>
                <button onclick="editarComentario(${comentario.id})">Editar</button>
                <button onclick="eliminarComentario(${comentario.id})">Eliminar</button>
            </div>
        `;
        document.getElementById('comentarios-lista')
                .insertAdjacentHTML('beforeend', comentarioHtml);
        // Limpiar campo
        document.getElementById('comentario-texto').value = '';
    });
}
```

---

## 🔐 Validaciones y Seguridad

### Validaciones del Sistema

#### 1. Registro de Usuario
- ✅ Email único en el sistema
- ✅ Formato válido de email
- ✅ Contraseña mínimo 6 caracteres
- ✅ Todos los campos obligatorios

#### 2. Inicio de Sesión
- ✅ Verificación de credenciales
- ✅ Manejo de sesiones
- ✅ Redirección según tipo de usuario

#### 3. Operaciones de Películas (Admin)
- ✅ Solo administradores pueden crear/editar/eliminar
- ✅ Año debe ser número válido
- ✅ Categoría debe existir
- ✅ Campos obligatorios completos

#### 4. Comentarios (Cliente)
- ✅ Usuario debe estar autenticado
- ✅ Comentario no puede estar vacío
- ✅ Solo autor puede editar/eliminar su comentario
- ✅ Validación de longitud máxima

#### 5. Likes
- ✅ Usuario autenticado
- ✅ Un like por usuario por película
- ✅ No permitir múltiples likes del mismo usuario

---

## 📱 Responsive Design

### Consideraciones CSS

```css
/* Mobile First */
.pelicula-card {
    width: 100%;
    margin: 10px 0;
}

/* Tablet */
@media (min-width: 768px) {
    .peliculas-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .peliculas-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

---

## 📈 Flujo de Datos Completo

### Diagrama de Flujo General

```
[Usuario] 
   ↓
[Registrarse/Login]
   ↓
[Validación de Tipo]
   ├─→ [Admin] → Panel Admin
   │              ├─→ Crear Película
   │              ├─→ Editar Película
   │              └─→ Eliminar Película
   │
   └─→ [Cliente] → Catálogo
                   ├─→ Ver Películas
                   ├─→ Dar Like
                   └─→ Comentar
                       ├─→ Crear Comentario
                       ├─→ Editar Comentario
                       └─→ Eliminar Comentario
```

---

## 🚀 Funcionalidades Avanzadas (Opcionales)

### 1. Sistema de Búsqueda
- Buscar películas por nombre
- Buscar por director
- Buscar por año

### 2. Ordenamiento
- Ordenar por año (ascendente/descendente)
- Ordenar por likes (más populares)
- Ordenar por cantidad de comentarios

### 3. Perfil de Usuario
- Ver historial de comentarios
- Ver películas que le gustan
- Estadísticas personales

### 4. Sistema de Notificaciones
- Notificar cuando hay respuestas a comentarios
- Notificar nuevas películas en categorías favoritas

---

## ✅ Checklist de Implementación

### Backend (Java)
- [ ] Clase Usuario
- [ ] Clase Pelicula
- [ ] Clase Categoria
- [ ] Clase Comentario
- [ ] Clase SistemaRecomendador
- [ ] Servlet de Login
- [ ] Servlet de Registro
- [ ] Servlet de Películas (CRUD)
- [ ] Servlet de Comentarios (CRUD)
- [ ] Servlet de Likes
- [ ] Manejo de sesiones

### Frontend (HTML/CSS)
- [ ] Página de registro
- [ ] Página de login
- [ ] Panel de administrador
- [ ] Catálogo de películas (cliente)
- [ ] Página de detalles de película
- [ ] Formularios con validación
- [ ] Estilos responsive
- [ ] Componentes reutilizables

### JavaScript/DOM
- [ ] Función darLike()
- [ ] Función agregarComentario()
- [ ] Función editarComentario()
- [ ] Función eliminarComentario()
- [ ] Función crearPelicula()
- [ ] Función editarPelicula()
- [ ] Función eliminarPelicula()
- [ ] Actualización dinámica del DOM
- [ ] Manejo de eventos
- [ ] Peticiones AJAX

### Validaciones
- [ ] Validación de registro
- [ ] Validación de login
- [ ] Validación de formularios
- [ ] Verificación de permisos
- [ ] Manejo de errores

---

## 📚 Conclusión

Este sistema implementa un flujo completo de gestión de películas utilizando:
- **POO en Java**: Clases, herencia, encapsulamiento
- **Manipulación del DOM**: Actualizaciones dinámicas sin recargar
- **Arquitectura Cliente-Servidor**: Separación de responsabilidades
- **Validación de usuarios**: Control de acceso basado en roles
- **Interfaz interactiva**: HTML5, CSS3 y JavaScript

El sistema distingue claramente entre:
- **Administradores**: Gestión completa del catálogo
- **Clientes**: Consumo e interacción con el contenido

Todas las operaciones se realizan de manera dinámica, actualizando el DOM sin necesidad de recargar la página, proporcionando una experiencia de usuario fluida y moderna.