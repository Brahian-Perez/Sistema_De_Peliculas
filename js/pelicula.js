class Categoria {
  constructor(nombre, descripcion = '') {
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}

class Comentario {
  static siguienteId = 1;

  constructor(usuario, texto, fecha = null) {
    this.id = Comentario.siguienteId++;
    this.usuario = usuario;
    this.texto = texto;
    this.fecha = fecha || new Date().toLocaleDateString();
  }

  actualizarTexto(nuevoTexto) {
    this.texto = nuevoTexto;
  }
}

class Pelicula {
  constructor(nombre, director, año, sinopsis, categoria) {
    this.id = `pel-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.nombre = nombre;
    this.director = director;
    this.año = Number(año);
    this.sinopsis = sinopsis;
    this.categoria = categoria;
    this.likes = 0;
    this.comentarios = [];
  }

  darMeGusta() {
    this.likes += 1;
  }

  agregarComentario(comentario) {
    this.comentarios.push(comentario);
  }

  actualizarDatos(nombre, director, año, sinopsis, categoria) {
    this.nombre = nombre;
    this.director = director;
    this.año = Number(año);
    this.sinopsis = sinopsis;
    this.categoria = categoria;
  }
}

class SistemaRecomendador {
  constructor() {
    this.peliculas = [];
    this.categorias = [];
  }

  agregarPelicula(pelicula) {
    this.peliculas.push(pelicula);
  }

  agregarCategoria(categoria) {
    this.categorias.push(categoria);
  }

  listarPeliculas() {
    return [...this.peliculas];
  }

  listarCategorias() {
    return [...this.categorias];
  }

  eliminarPelicula(peliculaId) {
    this.peliculas = this.peliculas.filter((pelicula) => pelicula.id !== peliculaId);
  }
}

const sistema = new SistemaRecomendador();

function inicializarSistema() {
  sistema.agregarCategoria(new Categoria('Acción', 'Películas llenas de ritmo, aventura y efectos.'));
  sistema.agregarCategoria(new Categoria('Drama', 'Historias humanas con contenido emocional y reflexivo.'));
  sistema.agregarCategoria(new Categoria('Ciencia Ficción', 'Títulos con tecnología, futuro y mundos imaginarios.'));
  sistema.agregarCategoria(new Categoria('Terror', 'Películas diseñadas para generar miedo y tensión.'));

  sistema.agregarPelicula(
    new Pelicula(
      'Oppenheimer',
      'Christopher Nolan',
      2023,
      'Biografía sobre el físico J. Robert Oppenheimer y la creación de la bomba atómica.',
      'Drama'
    )
  );

  sistema.agregarPelicula(
    new Pelicula(
      'Dune',
      'Denis Villeneuve',
      2021,
      'Aventura épica en un planeta desértico donde se libra una guerra por un recurso valioso.',
      'Ciencia Ficción'
    )
  );

  renderPeliculas();
}

function crearPelicula() {
  const nombre = document.getElementById('p-titulo').value.trim();
  const director = document.getElementById('p-director').value.trim();
  const año = document.getElementById('p-year').value.trim();
  const categoria = document.getElementById('p-categoria').value;
  const sinopsis = document.getElementById('p-sinopsis').value.trim();

  if (!nombre || !director || !año || !sinopsis) {
    alert('Por favor completa todos los campos de la película.');
    return;
  }

  if (isNaN(año) || Number(año) < 1800 || Number(año) > new Date().getFullYear() + 2) {
    alert('Ingresa un año válido.');
    return;
  }

  const nuevaPelicula = new Pelicula(nombre, director, año, sinopsis, categoria);
  sistema.agregarPelicula(nuevaPelicula);
  limpiarFormularioPeliculas();
  renderPeliculas();
}

function limpiarFormularioPeliculas() {
  document.getElementById('p-titulo').value = '';
  document.getElementById('p-director').value = '';
  document.getElementById('p-year').value = new Date().getFullYear();
  document.getElementById('p-sinopsis').value = '';
  document.getElementById('p-categoria').selectedIndex = 0;
}

function renderPeliculas() {
  const contenedor = document.getElementById('lista-peliculas');
  contenedor.innerHTML = '';

  sistema.listarPeliculas().forEach((pelicula) => {
    const card = document.createElement('article');
    card.className = 'movie-card';

    const comentariosHtml = pelicula.comentarios
      .map(
        (comentario) => `
          <div class="comment-card">
            <strong>${comentario.usuario}</strong> <span>${comentario.fecha}</span>
            <p>${comentario.texto}</p>
            <div class="comment-actions">
              <button class="btn-mini" onclick="actualizarComentario('${pelicula.id}','${comentario.id}')">Editar</button>
              <button class="btn-mini btn-danger" onclick="eliminarComentario('${pelicula.id}','${comentario.id}')">Eliminar</button>
            </div>
          </div>
        `
      )
      .join('');

    card.innerHTML = `
      <div class="movie-card-header">
        <h3>${pelicula.nombre}</h3>
        <span class="movie-category">${pelicula.categoria}</span>
      </div>
      <p><strong>Director:</strong> ${pelicula.director}</p>
      <p><strong>Año:</strong> ${pelicula.año}</p>
      <p class="movie-sinopsis">${pelicula.sinopsis}</p>
      <div class="movie-actions">
        <button class="btn-outline" onclick="darLike('${pelicula.id}')">👍 ${pelicula.likes}</button>
        <button class="btn-outline" onclick="agregarComentario('${pelicula.id}')">💬 Comentar</button>
        <button class="btn-danger" onclick="eliminarPelicula('${pelicula.id}')">Eliminar</button>
      </div>
      <div class="movie-comments">
        <h4>Comentarios (${pelicula.comentarios.length})</h4>
        ${comentariosHtml || '<p class="empty-state">Aún no hay comentarios.</p>'}
      </div>
    `;

    contenedor.appendChild(card);
  });
}

function darLike(peliculaId) {
  const pelicula = sistema.peliculas.find((item) => item.id === peliculaId);
  if (!pelicula) return;

  pelicula.darMeGusta();
  renderPeliculas();
}

function agregarComentario(peliculaId) {
  const pelicula = sistema.peliculas.find((item) => item.id === peliculaId);
  if (!pelicula) return;

  const autor = prompt('Ingresa tu nombre:');
  if (!autor || !autor.trim()) return;

  const texto = prompt('Escribe tu comentario:');
  if (!texto || !texto.trim()) return;

  const comentario = new Comentario(autor.trim(), texto.trim());
  pelicula.agregarComentario(comentario);
  renderPeliculas();
}

function actualizarComentario(peliculaId, comentarioId) {
  const pelicula = sistema.peliculas.find((item) => item.id === peliculaId);
  if (!pelicula) return;

  const comentario = pelicula.comentarios.find((c) => c.id === Number(comentarioId));
  if (!comentario) return;

  const nuevoTexto = prompt('Actualiza tu comentario:', comentario.texto);
  if (!nuevoTexto || !nuevoTexto.trim()) return;

  comentario.actualizarTexto(nuevoTexto.trim());
  renderPeliculas();
}

function eliminarComentario(peliculaId, comentarioId) {
  const pelicula = sistema.peliculas.find((item) => item.id === peliculaId);
  if (!pelicula) return;

  pelicula.comentarios = pelicula.comentarios.filter((c) => c.id !== Number(comentarioId));
  renderPeliculas();
}

function eliminarPelicula(peliculaId) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta película?')) return;
  sistema.eliminarPelicula(peliculaId);
  renderPeliculas();
}

document.addEventListener('DOMContentLoaded', inicializarSistema);
