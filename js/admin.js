// ===== FUNCIONES ESPECÍFICAS DEL ADMINISTRADOR =====

let peliculaEnEdicion = null;

function editarPelicula(peliculaId) {
    peliculaEnEdicion = peliculas.find(p => p.id === peliculaId);
    if (!peliculaEnEdicion) return;

    document.getElementById('edit-titulo').value = peliculaEnEdicion.titulo;
    document.getElementById('edit-director').value = peliculaEnEdicion.director;
    document.getElementById('edit-year').value = peliculaEnEdicion.año;
    document.getElementById('edit-categoria').value = peliculaEnEdicion.categoria;
    document.getElementById('edit-sinopsis').value = peliculaEnEdicion.sinopsis;
    document.getElementById('edit-message').textContent = '';
    document.getElementById('edit-modal').classList.remove('hidden');
}

function cerrarModalEdicion() {
    document.getElementById('edit-modal').classList.add('hidden');
    peliculaEnEdicion = null;
}

function guardarEdicionPelicula() {
    if (!peliculaEnEdicion) return;

    const titulo = document.getElementById('edit-titulo').value.trim();
    const director = document.getElementById('edit-director').value.trim();
    const año = parseInt(document.getElementById('edit-year').value);
    const categoria = document.getElementById('edit-categoria').value;
    const sinopsis = document.getElementById('edit-sinopsis').value.trim();
    const msgDiv = document.getElementById('edit-message');

    if (!titulo || !director || !año || !categoria || !sinopsis) {
        msgDiv.textContent = '❌ Todos los campos son obligatorios';
        return;
    }

    if (año < 1900 || año > new Date().getFullYear() + 5) {
        msgDiv.textContent = '❌ Ingresa un año válido';
        return;
    }

    const duplicado = peliculas.some(p => p.titulo.toLowerCase() === titulo.toLowerCase() && p.id !== peliculaEnEdicion.id);
    if (duplicado) {
        msgDiv.textContent = '❌ Ya existe una película con ese título';
        return;
    }

    const index = peliculas.findIndex(p => p.id === peliculaEnEdicion.id);
    peliculas[index] = { ...peliculas[index], titulo, director, año, categoria, sinopsis };
    localStorage.setItem('peliculas', JSON.stringify(peliculas));
    mostrarPeliculas(peliculas);
    cerrarModalEdicion();
}

function eliminarPelicula(peliculaId) {
    // Función para eliminar película
    if (confirm('¿Estás seguro de que deseas eliminar esta película?')) {
        peliculas = peliculas.filter(p => p.id !== peliculaId);
        localStorage.setItem('peliculas', JSON.stringify(peliculas));
        mostrarPeliculas(peliculas);
        alert('Película eliminada exitosamente');
    }
}

function verEstadisticas() {
    const totalPeliculas = peliculas.length;
    const totalLikes = peliculas.reduce((sum, p) => sum + p.likes, 0);
    const totalComentarios = peliculas.reduce((sum, p) => sum + p.comentarios.length, 0);

    document.getElementById('stat-peliculas').textContent = totalPeliculas;
    document.getElementById('stat-likes').textContent = totalLikes;
    document.getElementById('stat-comentarios').textContent = totalComentarios;
    document.getElementById('stats-modal').classList.remove('hidden');
}

function gestionarCategorias() {
    // Función para gestionar categorías
    alert('Gestión de categorías en desarrollo');
}
