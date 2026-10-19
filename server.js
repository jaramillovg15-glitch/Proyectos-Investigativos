require('dotenv').config();

const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// pg lee PGHOST, PGPORT, PGUSER, PGPASSWORD y PGDATABASE del archivo .env
const pool = new Pool();

// Solo desarrollo: permite que la página abierta con Live Server (puerto 5500) consulte la API
const ORIGENES_DESARROLLO = ['http://127.0.0.1:5500', 'http://localhost:5500'];
app.use((req, res, next) => {
    if (ORIGENES_DESARROLLO.includes(req.headers.origin)) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
    next();
});

// Responde con error 500. En desarrollo incluye el motivo real para poder encontrar el problema.
function errorServidor(res, mensaje, error) {
    console.error(error);
    const respuesta = { error: mensaje };
    if (process.env.NODE_ENV !== 'production') respuesta.detalle = error.message;
    res.status(500).json(respuesta);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- GET /api/categorias ----------
app.get('/api/categorias', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, nombre FROM categorias ORDER BY id');
        res.json(rows);
    } catch (error) {
        errorServidor(res, 'No se pudieron cargar las categorías', error);
    }
});

// ---------- GET /api/productos ----------
// Filtros opcionales: ?destacados=true  ?oferta=true  ?categoria=Selecciones
// Cada producto incluye "tallas": solo las que tienen stock.
app.get('/api/productos', async (req, res) => {
    try {
        const condiciones = ['p.activo = true'];
        const valores = [];

        if (req.query.destacados === 'true') {
            condiciones.push('p.destacado = true');
        }
        if (req.query.oferta === 'true') {
            condiciones.push('p.en_oferta = true');
        }
        if (req.query.categoria) {
            valores.push(req.query.categoria);
            condiciones.push(`c.nombre ILIKE $${valores.length}`);
        }

        const { rows } = await pool.query(
            `SELECT p.id, p.nombre, p.precio, p.imagen, p.en_oferta, c.nombre AS categoria,
                    COALESCE((
                        SELECT json_agg(
                                   json_build_object('talla', t.talla, 'stock', t.stock)
                                   ORDER BY CASE t.talla
                                       WHEN 'S' THEN 1 WHEN 'M' THEN 2 WHEN 'L' THEN 3
                                       WHEN 'XL' THEN 4 ELSE 5 END
                               )
                        FROM producto_tallas t
                        WHERE t.producto_id = p.id AND t.stock > 0
                    ), '[]'::json) AS tallas
             FROM productos p
             JOIN categorias c ON c.id = p.categoria_id
             WHERE ${condiciones.join(' AND ')}
             ORDER BY p.id`,
            valores
        );

        res.json(rows.map((p) => ({ ...p, precio: Number(p.precio) })));
    } catch (error) {
        errorServidor(res, 'No se pudieron cargar los productos', error);
    }
});

// ---------- GET /api/productos/:id (con tallas y stock) ----------
app.get('/api/productos/:id', async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Id inválido' });
    }

    try {
        const producto = await pool.query(
            `SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.en_oferta, c.nombre AS categoria
             FROM productos p
             JOIN categorias c ON c.id = p.categoria_id
             WHERE p.id = $1 AND p.activo = true`,
            [id]
        );

        if (producto.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const tallas = await pool.query(
            'SELECT talla, stock FROM producto_tallas WHERE producto_id = $1 ORDER BY talla',
            [id]
        );

        res.json({
            ...producto.rows[0],
            precio: Number(producto.rows[0].precio),
            tallas: tallas.rows,
        });
    } catch (error) {
        errorServidor(res, 'No se pudo cargar el producto', error);
    }
});

app.listen(PORT, () => {
    console.log(`Tienda lista en http://localhost:${PORT}`);
});