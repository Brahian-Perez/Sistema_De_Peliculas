// ===== FUNCIONES ESPECÍFICAS DEL CLIENTE =====

// Este archivo contiene funciones específicas para usuarios cliente
// La mayoría de la lógica está centralizada en usuario.js

function traerMisLikes() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    // Aquí se podrían guardar los likes del usuario específico
    // Por ahora se maneja a nivel global
}

function traerMisComentarios() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const misPeliculas = peliculas.filter(p => 
        p.comentarios.some(c => c.usuario === usuarioActual.nombre)
    );
    return misPeliculas;
}

function actualizarEstadisticas() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    let totalLikes = 0;
    let totalComentarios = 0;

    peliculas.forEach(pelicula => {
        totalComentarios += pelicula.comentarios.filter(c => c.usuario === usuarioActual.nombre).length;
    });

    document.getElementById('my-likes-count').textContent = totalLikes;
    document.getElementById('my-comments-count').textContent = totalComentarios;
}
