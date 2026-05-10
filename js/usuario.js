// ===== UTILIDAD DE SEGURIDAD =====

function sanitizar(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

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
    actualizarEstadisticas();
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
const carrito = new Carrito();

function cargarPeliculas() {
    // Cargar películas del localStorage o usar ejemplos
    const peliculasGuardadas = JSON.parse(localStorage.getItem('peliculas')) || [];
    
    if (peliculasGuardadas.length === 0) {
        peliculas = [
            new Pelicula({ id: 1, titulo: 'Oppenheimer', director: 'Christopher Nolan', año: 2023, categoria: 'Drama', sinopsis: 'La historia de J. Robert Oppenheimer y su papel en el Proyecto Manhattan durante la Segunda Guerra Mundial.', puntuacion: 5, imagen: '💣', likes: 245, comentarios: [] }),
            new Pelicula({ id: 2, titulo: 'Dune', director: 'Denis Villeneuve', año: 2021, categoria: 'Ciencia Ficción', sinopsis: 'Paul Atreides viaja a Arrakis, el planeta más peligroso del universo, para llevar a cabo su destino.', puntuacion: 4, imagen: '🏜️', likes: 532, comentarios: [] }),
            new Pelicula({ id: 3, titulo: 'The Shawshank Redemption', director: 'Frank Darabont', año: 1994, categoria: 'Drama', sinopsis: 'Dos hombres encarcelados se unen a lo largo de varios años, encontrando solace y redención.', puntuacion: 5, imagen: '🔒', likes: 1234, comentarios: [] }),
            new Pelicula({ id: 4, titulo: 'Inception', director: 'Christopher Nolan', año: 2010, categoria: 'Ciencia Ficción', sinopsis: 'Un ladrón que roba secretos corporativos del subconsciente durante el sueño.', puntuacion: 5, imagen: '🌀', likes: 876, comentarios: [] }),
            new Pelicula({ id: 5, titulo: 'The Dark Knight', director: 'Christopher Nolan', año: 2008, categoria: 'Acción', sinopsis: 'Batman enfrenta a un enemigo caótico conocido como el Joker, quien busca sumir a Gotham en la anarquía.', puntuacion: 5, imagen: '🦇', likes: 1045, comentarios: [] })
        ];
        localStorage.setItem('peliculas', JSON.stringify(peliculas));
    } else {
        peliculas = peliculasGuardadas.map(p => new Pelicula(p));
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

    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const esAdmin = usuarioActual && usuarioActual.tipo === 'Admin';

    listaPeliculas.forEach(pelicula => {
        const yaLeGusto = !esAdmin && usuarioActual && yaDioLike(usuarioActual.id, pelicula.id);
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="movie-card-header">
                <h3 class="movie-card-title">${sanitizar(pelicula.titulo)}</h3>
                <p class="movie-card-director">Director: ${sanitizar(pelicula.director)}</p>
            </div>
            <div class="movie-card-body">
                <div class="movie-card-info">
                    <span class="movie-card-year">${sanitizar(String(pelicula.año))}</span>
                    <span class="movie-card-category">${sanitizar(pelicula.categoria)}</span>
                </div>
                <div class="movie-card-stats">
                    <div class="movie-card-stat">
                        <span>❤️ ${pelicula.likes}</span>
                    </div>
                    <div class="movie-card-stat">
                        <span>💬 ${pelicula.comentarios.length}</span>
                    </div>
                </div>
                <div class="movie-card-actions ${esAdmin ? 'actions-admin' : 'actions-client'}">
                    ${esAdmin ? `
                        <button class="btn-card btn-edit" onclick="editarPelicula(${pelicula.id})">
                            ✏️ Editar
                        </button>
                        <button class="btn-card btn-delete" onclick="eliminarPelicula(${pelicula.id})">
                            🗑️ Eliminar
                        </button>
                    ` : `
                        <button class="btn-card btn-like" onclick="darLikeDesdeTargeta(${pelicula.id}, this)" ${yaLeGusto ? 'disabled' : ''}>
                            ${yaLeGusto ? '❤️ Ya te gusta' : '❤️ Me gusta'}
                        </button>
                        <button class="btn-card btn-recommend" onclick="agregarARecomendados(${pelicula.id}, this)">
                            ⭐ Recomendar
                        </button>
                        <button class="btn-card btn-details" onclick="abrirDetalles(${pelicula.id})">
                            💬 Detalles
                        </button>
                    `}
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

        const btnLike = document.getElementById('btn-like');
        const yaLeGusto = yaDioLike(usuarioActual.id, peliculaSeleccionada.id);
        btnLike.disabled = yaLeGusto;
        btnLike.classList.toggle('liked', yaLeGusto);
        btnLike.textContent = yaLeGusto ? '❤️ Ya te gusta esta película' : '❤️ Me gusta esta película';
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

    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    peliculaSeleccionada.comentarios.forEach(comentario => {
        const esAutor = usuarioActual && usuarioActual.nombre === comentario.usuario;

        const comentarioDiv = document.createElement('div');
        comentarioDiv.className = 'comment-item';
        comentarioDiv.id = `comentario-${comentario.id}`;
        comentarioDiv.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">👤 ${sanitizar(comentario.usuario)}</span>
                <span class="comment-date">${sanitizar(comentario.fecha)}</span>
            </div>
            <p class="comment-text">${sanitizar(comentario.texto)}</p>
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
    actualizarEstadisticas();
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
            <textarea id="edit-text-${comentarioId}" class="edit-textarea">${sanitizar(comentario.texto)}</textarea>
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

function yaDioLike(usuarioId, peliculaId) {
    const likes = JSON.parse(localStorage.getItem('likes')) || [];
    return likes.some(l => l.usuarioId === usuarioId && l.peliculaId === peliculaId);
}

function registrarLike(usuarioId, peliculaId) {
    const likes = JSON.parse(localStorage.getItem('likes')) || [];
    likes.push({ usuarioId, peliculaId });
    localStorage.setItem('likes', JSON.stringify(likes));
}

function darLikeDesdeTargeta(peliculaId, btn) {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (yaDioLike(usuarioActual.id, peliculaId)) {
        btn.disabled = true;
        btn.textContent = '❤️ Ya te gusta';
        return;
    }
    const pelicula = peliculas.find(p => p.id === peliculaId);
    if (!pelicula) return;
    pelicula.likes++;
    const index = peliculas.findIndex(p => p.id === peliculaId);
    peliculas[index] = pelicula;
    localStorage.setItem('peliculas', JSON.stringify(peliculas));
    registrarLike(usuarioActual.id, peliculaId);

    btn.disabled = true;
    btn.textContent = '❤️ Ya te gusta';

    const likeStat = btn.closest('.movie-card').querySelector('.movie-card-stat span');
    if (likeStat) likeStat.textContent = `❤️ ${pelicula.likes}`;

    actualizarEstadisticas();
}

function darLike() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (yaDioLike(usuarioActual.id, peliculaSeleccionada.id)) return;

    peliculaSeleccionada.likes++;
    actualizarPeliculaEnStorage();
    registrarLike(usuarioActual.id, peliculaSeleccionada.id);
    document.getElementById('modal-likes').textContent = peliculaSeleccionada.likes;

    const btnLike = document.getElementById('btn-like');
    btnLike.disabled = true;
    btnLike.classList.add('liked');
    btnLike.textContent = '❤️ Ya te gusta esta película';
    actualizarEstadisticas();
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

function filtrarPeliculas() {
    const termino = document.getElementById('search-input').value.toLowerCase();
    const categoria = document.getElementById('filtro-categoria').value;

    const filtradas = peliculas.filter(p => {
        const coincideTexto = !termino ||
            p.titulo.toLowerCase().includes(termino) ||
            p.director.toLowerCase().includes(termino);
        const coincideCategoria = !categoria || p.categoria === categoria;
        return coincideTexto && coincideCategoria;
    });

    mostrarPeliculas(filtradas);
}

function buscarPeliculas() {
    filtrarPeliculas();
}

function aplicarFiltro() {
    filtrarPeliculas();
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
    document.getElementById('lista-peliculas').scrollIntoView({ behavior: 'smooth' });
}

function mostrarOpcionEliminar() {
    document.getElementById('lista-peliculas').scrollIntoView({ behavior: 'smooth' });
}

// ===== LISTA DE RECOMENDADOS =====

function agregarARecomendados(peliculaId, btn) {
    const pelicula = peliculas.find(p => p.id === peliculaId);
    if (!pelicula) return;

    const yaEsta = carrito.items.some(item => item.pelicula.id === peliculaId);
    if (yaEsta) {
        btn.disabled = true;
        btn.textContent = '✅ Recomendada';
        return;
    }

    carrito.agregarProducto(pelicula);
    btn.disabled = true;
    btn.textContent = '✅ Recomendada';
}

// ===== EVENTOS CON addEventListener =====

function inicializarEventos() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filtrarPeliculas);
    }

    const filtroCategoria = document.getElementById('filtro-categoria');
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', filtrarPeliculas);
    }

    const btnLogout = document.querySelector('.btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', cerrarSesion);
    }

    const btnVaciar = document.getElementById('btn-vaciar-lista');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => carrito.vaciarCarrito());
    }
}

// Inicializar la app cuando cargue la página
window.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
    inicializarEventos();
});
