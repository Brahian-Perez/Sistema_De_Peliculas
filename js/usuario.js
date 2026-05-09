// ===== MANEJO DE USUARIO Y SESIÓN =====

function inicializarApp() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    if (!usuarioActual) {
        window.location.href = 'inicio_sesion.html';
        return;
    }

    // Mostrar información del usuario
    document.getElementById('username').textContent = usuarioActual.nombre;
    document.getElementById('welcome-message').textContent = `Bienvenido ${usuarioActual.nombre}`;

    const userTypeBadge = document.getElementById('user-type');
    const tipoUsuario = usuarioActual.tipo;

    if (tipoUsuario === 'Admin') {
        userTypeBadge.textContent = '👨‍💼 Administrador';
        userTypeBadge.classList.add('admin');
        mostrarPanelAdmin();
    } else {
        userTypeBadge.textContent = '👤 Cliente';
        userTypeBadge.classList.add('client');
        mostrarPanelCliente();
    }

    // Cargar películas
    cargarPeliculas();
}

function mostrarPanelAdmin() {
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('client-panel').classList.add('hidden');
    document.getElementById('panel-title').textContent = '👨‍💼 Panel de Administrador';
}

function mostrarPanelCliente() {
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('client-panel').classList.remove('hidden');
    document.getElementById('panel-title').textContent = '👤 Panel de Usuario';
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('usuarioActual');
        window.location.href = 'inicio_sesion.html';
    }
}

// ===== GESTIÓN DE PELÍCULAS =====

let peliculas = [];
let peliculaSeleccionada = null;

function cargarPeliculas() {
    // Cargar películas del localStorage o usar ejemplos
    const peliculasGuardadas = JSON.parse(localStorage.getItem('peliculas')) || [];
    
    if (peliculasGuardadas.length === 0) {
        // Películas de ejemplo
        peliculas = [
            {
                id: 1,
                titulo: 'Oppenheimer',
                director: 'Christopher Nolan',
                año: 2023,
                categoria: 'Drama',
                sinopsis: 'La historia de J. Robert Oppenheimer y su papel en el Proyecto Manhattan durante la Segunda Guerra Mundial.',
                likes: 245,
                comentarios: []
            },
            {
                id: 2,
                titulo: 'Dune',
                director: 'Denis Villeneuve',
                año: 2021,
                categoria: 'Ciencia Ficción',
                sinopsis: 'Paul Atreides viaja a Arrakis, el planeta más peligroso del universo, para llevar a cabo su destino.',
                likes: 532,
                comentarios: []
            },
            {
                id: 3,
                titulo: 'The Shawshank Redemption',
                director: 'Frank Darabont',
                año: 1994,
                categoria: 'Drama',
                sinopsis: 'Dos hombres encarcelados se unen a lo largo de varios años, encontrando solace y redención.',
                likes: 1234,
                comentarios: []
            },
            {
                id: 4,
                titulo: 'Inception',
                director: 'Christopher Nolan',
                año: 2010,
                categoria: 'Ciencia Ficción',
                sinopsis: 'Un ladrón que roba secretos corporativos del subconsciente durante el sueño.',
                likes: 876,
                comentarios: []
            },
            {
                id: 5,
                titulo: 'The Dark Knight',
                director: 'Christopher Nolan',
                año: 2008,
                categoria: 'Acción',
                sinopsis: 'Batman enfrenta a un enemigo caótico conocido como el Joker, quien busca sumir a Gotham en la anarquía.',
                likes: 1045,
                comentarios: []
            }
        ];
        localStorage.setItem('peliculas', JSON.stringify(peliculas));
    } else {
        peliculas = peliculasGuardadas;
    }

    mostrarPeliculas(peliculas);
}

function mostrarPeliculas(listaPeliculas) {
    const contenedor = document.getElementById('lista-peliculas');
    contenedor.innerHTML = '';

    if (listaPeliculas.length === 0) {
        contenedor.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">No hay películas disponibles</div>';
        return;
    }

    listaPeliculas.forEach(pelicula => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="movie-card-header">
                <h3 class="movie-card-title">${pelicula.titulo}</h3>
                <p class="movie-card-director">Director: ${pelicula.director}</p>
            </div>
            <div class="movie-card-body">
                <div class="movie-card-info">
                    <span class="movie-card-year">${pelicula.año}</span>
                    <span class="movie-card-category">${pelicula.categoria}</span>
                </div>
                <div class="movie-card-stats">
                    <div class="movie-card-stat">
                        <span>❤️ ${pelicula.likes}</span>
                    </div>
                    <div class="movie-card-stat">
                        <span>💬 ${pelicula.comentarios.length}</span>
                    </div>
                </div>
                <div class="movie-card-actions">
                    <button class="btn-card btn-like" onclick="abrirDetalles(${pelicula.id})">
                        ❤️ Me gusta
                    </button>
                    <button class="btn-card btn-details" onclick="abrirDetalles(${pelicula.id})">
                        💬 Ver detalles
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

function abrirDetalles(peliculaId) {
    peliculaSeleccionada = peliculas.find(p => p.id === peliculaId);
    
    if (!peliculaSeleccionada) return;

    document.getElementById('modal-titulo').textContent = peliculaSeleccionada.titulo;
    document.getElementById('modal-director').textContent = peliculaSeleccionada.director;
    document.getElementById('modal-year').textContent = peliculaSeleccionada.año;
    document.getElementById('modal-categoria').textContent = peliculaSeleccionada.categoria;
    document.getElementById('modal-categoria-full').textContent = peliculaSeleccionada.categoria;
    document.getElementById('modal-sinopsis').textContent = peliculaSeleccionada.sinopsis;
    document.getElementById('modal-likes').textContent = peliculaSeleccionada.likes;
    document.getElementById('modal-comentarios').textContent = peliculaSeleccionada.comentarios.length;

    // Mostrar sección de comentarios y likes solo para clientes
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const clientActions = document.getElementById('client-actions');
    const addComment = document.getElementById('add-comment');
    
    if (usuarioActual.tipo === 'Cliente') {
        clientActions.classList.remove('hidden');
        addComment.classList.remove('hidden');
        
        // Habilitar botón de like si no lo ha presionado aún
        const btnLike = document.getElementById('btn-like');
        btnLike.disabled = false;
        btnLike.classList.remove('liked');
    } else {
        clientActions.classList.add('hidden');
        addComment.classList.add('hidden');
    }

    cargarComentarios();
    document.getElementById('movie-modal').classList.remove('hidden');
}

function cerrarModal() {
    document.getElementById('movie-modal').classList.add('hidden');
    document.getElementById('comment-text').value = '';
}

// ===== COMENTARIOS =====

function cargarComentarios() {
    const lista = document.getElementById('comments-list');
    lista.innerHTML = '';

    if (peliculaSeleccionada.comentarios.length === 0) {
        lista.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No hay comentarios. ¡Sé el primero en comentar!</p>';
        return;
    }

    peliculaSeleccionada.comentarios.forEach(comentario => {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        const esAutor = usuarioActual.nombre === comentario.usuario;

        const comentarioDiv = document.createElement('div');
        comentarioDiv.className = 'comment-item';
        comentarioDiv.id = `comentario-${comentario.id}`;
        comentarioDiv.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">👤 ${comentario.usuario}</span>
                <span class="comment-date">${comentario.fecha}</span>
            </div>
            <p class="comment-text">${comentario.texto}</p>
            ${esAutor ? `
                <div class="comment-actions">
                    <button class="comment-btn comment-btn-edit" onclick="editarComentario(${comentario.id})">
                        ✏️ Editar
                    </button>
                    <button class="comment-btn comment-btn-delete" onclick="eliminarComentario(${comentario.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            ` : ''}
        `;
        lista.appendChild(comentarioDiv);
    });
}

function publicarComentario() {
    const texto = document.getElementById('comment-text').value.trim();
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    if (!texto) {
        alert('El comentario no puede estar vacío');
        return;
    }

    if (texto.length > 500) {
        alert('El comentario no puede exceder 500 caracteres');
        return;
    }

    const nuevoComentario = {
        id: Date.now(),
        usuario: usuarioActual.nombre,
        texto: texto,
        fecha: new Date().toLocaleDateString('es-ES')
    };

    peliculaSeleccionada.comentarios.push(nuevoComentario);
    actualizarPeliculaEnStorage();
    document.getElementById('comment-text').value = '';
    cargarComentarios();
    document.getElementById('modal-comentarios').textContent = peliculaSeleccionada.comentarios.length;
}

function limpiarComentario() {
    document.getElementById('comment-text').value = '';
}

function editarComentario(comentarioId) {
    const comentario = peliculaSeleccionada.comentarios.find(c => c.id === comentarioId);
    if (!comentario) return;

    const comentarioDiv = document.getElementById(`comentario-${comentarioId}`);
    comentarioDiv.innerHTML = `
        <div class="comment-edit-form">
            <textarea id="edit-text-${comentarioId}" class="edit-textarea">${comentario.texto}</textarea>
            <div class="form-actions">
                <button class="comment-edit-form btn-save" onclick="guardarEdicionComentario(${comentarioId})">
                    💾 Guardar
                </button>
                <button class="comment-edit-form btn-cancel" onclick="cargarComentarios()">
                    ❌ Cancelar
                </button>
            </div>
        </div>
    `;
}

function guardarEdicionComentario(comentarioId) {
    const nuevoTexto = document.getElementById(`edit-text-${comentarioId}`).value.trim();
    const comentario = peliculaSeleccionada.comentarios.find(c => c.id === comentarioId);

    if (!nuevoTexto) {
        alert('El comentario no puede estar vacío');
        return;
    }

    if (nuevoTexto.length > 500) {
        alert('El comentario no puede exceder 500 caracteres');
        return;
    }

    comentario.texto = nuevoTexto;
    actualizarPeliculaEnStorage();
    cargarComentarios();
}

function eliminarComentario(comentarioId) {
    if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
        peliculaSeleccionada.comentarios = peliculaSeleccionada.comentarios.filter(c => c.id !== comentarioId);
        actualizarPeliculaEnStorage();
        cargarComentarios();
    }
}

// ===== LIKES =====

function darLike() {
    const btnLike = document.getElementById('btn-like');
    
    if (btnLike.disabled) {
        alert('Ya has dado like a esta película');
        return;
    }
    
    peliculaSeleccionada.likes++;
    actualizarPeliculaEnStorage();
    document.getElementById('modal-likes').textContent = peliculaSeleccionada.likes;
    
    // Deshabilitar botón y cambiar su apariencia
    btnLike.disabled = true;
    btnLike.classList.add('liked');
    btnLike.textContent = '❤️ Te gusta esta película';
    
    // Mostrar mensaje de éxito
    alert('¡Le has dado like a la película!');
}

// ===== UTILIDADES =====

function actualizarPeliculaEnStorage() {
    const index = peliculas.findIndex(p => p.id === peliculaSeleccionada.id);
    if (index !== -1) {
        peliculas[index] = peliculaSeleccionada;
        localStorage.setItem('peliculas', JSON.stringify(peliculas));
        mostrarPeliculas(peliculas);
    }
}

function buscarPeliculas() {
    const termino = document.getElementById('search-input').value.toLowerCase();
    const filtradas = peliculas.filter(p =>
        p.titulo.toLowerCase().includes(termino) ||
        p.director.toLowerCase().includes(termino)
    );
    mostrarPeliculas(filtradas);
}

function aplicarFiltro() {
    const categoria = document.getElementById('filtro-categoria').value;
    if (categoria === '') {
        mostrarPeliculas(peliculas);
    } else {
        const filtradas = peliculas.filter(p => p.categoria === categoria);
        mostrarPeliculas(filtradas);
    }
}

function scrollToTop() {
    document.getElementById('lista-peliculas').scrollTop = 0;
}

function mostrarFiltros() {
    alert('Usa el selector de categoría en la parte superior del catálogo');
}

// ===== ADMINISTRADOR =====

function crearPelicula() {
    const titulo = document.getElementById('p-titulo').value.trim();
    const director = document.getElementById('p-director').value.trim();
    const año = parseInt(document.getElementById('p-year').value);
    const categoria = document.getElementById('p-categoria').value;
    const sinopsis = document.getElementById('p-sinopsis').value.trim();
    const mensajeDiv = document.getElementById('admin-message');

    mensajeDiv.classList.remove('show');
    mensajeDiv.textContent = '';

    // Validaciones
    if (!titulo || !director || !año || !categoria || !sinopsis) {
        mensajeDiv.textContent = '❌ Todos los campos son obligatorios';
        mensajeDiv.classList.add('show');
        return;
    }

    if (titulo.length < 3) {
        mensajeDiv.textContent = '❌ El título debe tener al menos 3 caracteres';
        mensajeDiv.classList.add('show');
        return;
    }

    if (año < 1900 || año > new Date().getFullYear() + 5) {
        mensajeDiv.textContent = '❌ Ingresa un año válido';
        mensajeDiv.classList.add('show');
        return;
    }

    // Verificar si la película ya existe
    if (peliculas.some(p => p.titulo.toLowerCase() === titulo.toLowerCase())) {
        mensajeDiv.textContent = '❌ Esta película ya existe en el catálogo';
        mensajeDiv.classList.add('show');
        return;
    }

    // Crear nueva película
    const nuevaPelicula = {
        id: Date.now(),
        titulo: titulo,
        director: director,
        año: año,
        categoria: categoria,
        sinopsis: sinopsis,
        likes: 0,
        comentarios: []
    };

    peliculas.push(nuevaPelicula);
    localStorage.setItem('peliculas', JSON.stringify(peliculas));

    // Limpiar formulario
    document.getElementById('p-titulo').value = '';
    document.getElementById('p-director').value = '';
    document.getElementById('p-year').value = new Date().getFullYear();
    document.getElementById('p-categoria').value = '';
    document.getElementById('p-sinopsis').value = '';

    mensajeDiv.textContent = '✅ Película creada exitosamente';
    mensajeDiv.classList.add('show');

    mostrarPeliculas(peliculas);

    setTimeout(() => {
        mensajeDiv.classList.remove('show');
    }, 3000);
}

function mostrarOpcionEditar() {
    alert('Selecciona una película del catálogo y edita sus datos');
}

function mostrarOpcionEliminar() {
    alert('Selecciona una película del catálogo para eliminarla');
}

// Inicializar la app cuando cargue la página
window.addEventListener('DOMContentLoaded', inicializarApp);
