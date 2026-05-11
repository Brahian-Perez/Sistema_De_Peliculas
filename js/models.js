// ===== MODELOS POO =====

class Pelicula {
    constructor({ id, titulo, director, año, categoria, sinopsis, puntuacion = 0, imagen = '🎬', likes = 0, comentarios = [] }) {
        this.id = id;
        this.titulo = titulo;
        this.director = director;
        this.año = año;
        this.categoria = categoria;
        this.sinopsis = sinopsis;
        this.puntuacion = puntuacion; // valoración 1-5 estrellas
        this.imagen = imagen;
        this.likes = likes;
        this.comentarios = comentarios;
    }

    get nombre() {
        return this.titulo;
    }
}

class Carrito {
    constructor() {
        this.items = []; // { pelicula, cantidad }
    }

    agregarProducto(pelicula, cantidad = 1) {
        const existe = this.items.find(item => item.pelicula.id === pelicula.id);
        if (existe) return; // no duplicar en la lista
        this.items.push({ pelicula, cantidad });
        this.renderizar();
    }

    eliminarProducto(id) {
        this.items = this.items.filter(item => item.pelicula.id !== id);
        this.renderizar();
    }

    calcularTotal() {
        if (this.items.length === 0) return 0;
        const suma = this.items.reduce((sum, item) => sum + item.pelicula.puntuacion, 0);
        return (suma / this.items.length).toFixed(1);
    }

    vaciarCarrito() {
        this.items = [];
        this.renderizar();
    }

    renderizar() {
        const contenedor = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        const countEl = document.getElementById('cart-count');

        if (!contenedor) return;

        contenedor.innerHTML = '';

        if (this.items.length === 0) {
            const msg = document.createElement('p');
            msg.className = 'cart-empty';
            msg.textContent = 'Tu lista de recomendados está vacía';
            contenedor.appendChild(msg);
        } else {
            this.items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'cart-item';

                const icon = document.createElement('span');
                icon.className = 'cart-item-icon';
                icon.textContent = item.pelicula.imagen;

                const info = document.createElement('div');
                info.className = 'cart-item-info';

                const nombre = document.createElement('p');
                nombre.className = 'cart-item-name';
                nombre.textContent = item.pelicula.titulo;

                const estrellas = document.createElement('p');
                estrellas.className = 'cart-item-stars';
                estrellas.textContent = '⭐'.repeat(item.pelicula.puntuacion) || 'Sin valoración';

                info.appendChild(nombre);
                info.appendChild(estrellas);

                const btnEliminar = document.createElement('button');
                btnEliminar.className = 'cart-item-remove';
                btnEliminar.textContent = '✕';
                btnEliminar.addEventListener('click', () => this.eliminarProducto(item.pelicula.id));

                div.appendChild(icon);
                div.appendChild(info);
                div.appendChild(btnEliminar);
                contenedor.appendChild(div);
            });
        }

        if (totalEl) {
            totalEl.textContent = this.items.length > 0
                ? `⭐ ${this.calcularTotal()} promedio`
                : '—';
        }
        if (countEl) {
            countEl.textContent = this.items.length;
            countEl.style.display = this.items.length > 0 ? 'inline-block' : 'none';
        }
    }
}
