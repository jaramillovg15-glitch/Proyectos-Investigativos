const CLAVE_CARRITO = 'carrito';

// Si abres la página desde Live Server (puerto 5500), los datos se piden al servidor de Node (puerto 3000).
const API = location.port === '5500' ? 'http://localhost:3000' : '';

/* ---------- Carrito (se guarda en el navegador) ---------- */
function leerCarrito() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function actualizarContador() {
    const total = leerCarrito().reduce((suma, item) => suma + item.cantidad, 0);
    const contador = document.getElementById('contador-carrito');
    if (contador) contador.textContent = total;
}

function agregarAlCarrito(producto, talla) {
    const carrito = leerCarrito();
    const existente = carrito.find((item) => item.id === producto.id && item.talla === talla);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            talla: talla,
            cantidad: 1,
        });
    }

    guardarCarrito(carrito);
    actualizarContador();
}

/* ---------- Tarjeta de producto ---------- */
function crearTarjeta(producto) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'producto';

    if (producto.en_oferta) {
        const etiqueta = document.createElement('span');
        etiqueta.className = 'etiqueta-oferta';
        etiqueta.textContent = 'Oferta';
        tarjeta.appendChild(etiqueta);
    }

    const imagen = document.createElement('img');
    imagen.src = producto.imagen || 'img/logo/logo-transparente.png';
    imagen.alt = 'Camiseta ' + producto.nombre;
    imagen.onerror = () => {
        imagen.onerror = null;
        imagen.src = 'img/logo/logo-transparente.png';
    };

    const titulo = document.createElement('h3');
    titulo.textContent = producto.nombre;

    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.textContent = '$' + producto.precio.toFixed(2);

    tarjeta.append(imagen, titulo, precio);

    const boton = document.createElement('button');
    const tallas = producto.tallas || [];

    if (tallas.length === 0) {
        boton.textContent = 'Agotado';
        boton.disabled = true;
    } else {
        const selector = document.createElement('div');
        selector.className = 'selector-talla';

        const idSelect = 'talla-' + producto.id;

        const etiqueta = document.createElement('label');
        etiqueta.htmlFor = idSelect;
        etiqueta.textContent = 'Talla';

        const select = document.createElement('select');
        select.id = idSelect;
        tallas.forEach((t) => {
            const opcion = document.createElement('option');
            opcion.value = t.talla;
            opcion.textContent = t.talla;
            select.appendChild(opcion);
        });

        selector.append(etiqueta, select);
        tarjeta.appendChild(selector);

        boton.textContent = 'Agregar al carrito';
        boton.addEventListener('click', () => {
            agregarAlCarrito(producto, select.value);
            boton.textContent = '¡Agregada!';
            setTimeout(() => { boton.textContent = 'Agregar al carrito'; }, 1200);
        });
    }

    tarjeta.appendChild(boton);
    return tarjeta;
}

function mostrarMensaje(contenedor, texto) {
    const mensaje = document.createElement('p');
    mensaje.className = 'mensaje';
    mensaje.textContent = texto;
    contenedor.replaceChildren(mensaje);
}

/* ---------- Carga de productos desde la base de datos ----------
   Cada página decide qué mostrar con el atributo data-filtro:
   data-filtro="destacados=true"       (portada, es el valor por defecto)
   data-filtro="categoria=Selecciones"
   data-filtro="categoria=Europa"
   data-filtro="oferta=true"
--------------------------------------------------------------- */
async function cargarProductos() {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;

    const filtro = contenedor.dataset.filtro || 'destacados=true';
    const textoVacio = contenedor.dataset.vacio || 'Pronto tendremos productos aquí.';

    try {
        const respuesta = await fetch(API + '/api/productos?' + filtro);
        if (!respuesta.ok) throw new Error('Código ' + respuesta.status + ' en ' + respuesta.url);

        const productos = await respuesta.json();

        if (productos.length === 0) {
            mostrarMensaje(contenedor, textoVacio);
            return;
        }

        contenedor.replaceChildren(...productos.map(crearTarjeta));
    } catch (error) {
        console.error(error);
        mostrarMensaje(contenedor, 'No se pudieron cargar los productos. (' + error.message + ')');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
    cargarProductos();
});