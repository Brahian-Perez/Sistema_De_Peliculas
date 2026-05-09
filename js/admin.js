// ===== FUNCIONES ESPECÍFICAS DEL ADMINISTRADOR =====

// Este archivo contiene funciones específicas para usuarios administrador
// La mayoría de la lógica está centralizada en usuario.js

function editarPelicula(peliculaId) {
    // Función para editar película
    alert('Función de edición en desarrollo');
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
    // Ver estadísticas del sistema
    let totalPeliculas = peliculas.length;
    let totalLikes = peliculas.reduce((sum, p) => sum + p.likes, 0);
    let totalComentarios = peliculas.reduce((sum, p) => sum + p.comentarios.length, 0);
    
    console.log(`
        === ESTADÍSTICAS DEL SISTEMA ===
        Total de películas: ${totalPeliculas}
        Total de likes: ${totalLikes}
        Total de comentarios: ${totalComentarios}
    `);
}

function gestionarCategorias() {
    // Función para gestionar categorías
    alert('Gestión de categorías en desarrollo');
}
