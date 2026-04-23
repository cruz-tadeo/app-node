import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// ============================================================================
// CONFIGURACIÓN DE BD
// ============================================================================
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'appuserPassword123!',
  database: process.env.DB_NAME || 'app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Pool de conexiones
const pool = mysql.createPool(dbConfig);

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Error al obtener conexión:', error);
    return null;
  }
}

function sendSuccess(res, data, statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
}

function sendError(res, message, statusCode = 500, error = null) {
  console.error('Error:', message, error);
  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// RUTAS: HEALTH & STATUS
// ============================================================================

// Página principal
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>App Node.js - MySQL 8.0</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0; 
                padding: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container { 
                max-width: 1000px; 
                background: white; 
                padding: 40px; 
                border-radius: 12px; 
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            }
            h1 { 
                color: #333; 
                border-bottom: 3px solid #667eea; 
                padding-bottom: 15px;
                margin-top: 0;
            }
            h2 {
                color: #667eea;
                margin-top: 30px;
                font-size: 1.3em;
            }
            .info-box {
                background: #f0f4ff;
                border-left: 4px solid #667eea;
                padding: 15px;
                margin: 15px 0;
                border-radius: 4px;
            }
            .endpoint {
                background: #f9f9f9;
                border-left: 4px solid #667eea;
                padding: 15px;
                margin: 10px 0;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
            }
            .endpoint code {
                background: #e0e0e0;
                padding: 2px 6px;
                border-radius: 3px;
            }
            table {
                border-collapse: collapse;
                width: 100%;
                margin: 20px 0;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            th {
                background: #667eea;
                color: white;
            }
            tr:nth-child(even) {
                background: #f9f9f9;
            }
            .status {
                display: inline-block;
                padding: 10px 20px;
                border-radius: 5px;
                font-weight: bold;
                margin: 10px 0;
            }
            .status.ok {
                background: #d4edda;
                color: #155724;
            }
            .status.error {
                background: #f8d7da;
                color: #721c24;
            }
            .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 20px 0;
            }
            .card {
                background: #f0f4ff;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            .card h3 {
                margin-top: 0;
                color: #667eea;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 App Node.js + Express</h1>
            <p>Conectado a <strong>MySQL 8.0 en Google Cloud</strong></p>
            
            <div class="info-box">
                <strong>Estado:</strong> ✓ Aplicación iniciada correctamente
            </div>

            <h2>Información de Conexión</h2>
            <table>
                <tr><th>Parámetro</th><th>Valor</th></tr>
                <tr><td>Host</td><td>${dbConfig.host}</td></tr>
                <tr><td>Puerto</td><td>${dbConfig.port}</td></tr>
                <tr><td>Usuario</td><td>${dbConfig.user}</td></tr>
                <tr><td>Base de Datos</td><td>${dbConfig.database}</td></tr>
                <tr><td>Tipo de IP</td><td>${dbConfig.host.startsWith('10.') ? 'Privada (VPC)' : 'Pública'}</td></tr>
                <tr><td>Runtime</td><td>Node.js ${process.version}</td></tr>
            </table>

            <h2>Endpoints Disponibles</h2>
            
            <div class="grid">
                <div class="card">
                    <h3>Información General</h3>
                    <div class="endpoint">GET /health</div>
                    <p>Estado de la aplicación</p>
                    
                    <div class="endpoint">GET /db-status</div>
                    <p>Estado de la conexión a BD</p>
                </div>

                <div class="card">
                    <h3>Usuarios</h3>
                    <div class="endpoint">GET /api/usuarios</div>
                    <p>Listar todos los usuarios</p>
                    
                    <div class="endpoint">GET /api/usuario/:id</div>
                    <p>Obtener usuario específico</p>
                </div>

                <div class="card">
                    <h3>Productos</h3>
                    <div class="endpoint">GET /api/productos</div>
                    <p>Listar todos los productos</p>
                    
                    <div class="endpoint">GET /api/categorias</div>
                    <p>Listar categorías</p>
                </div>

                <div class="card">
                    <h3>Pedidos</h3>
                    <div class="endpoint">GET /api/pedidos</div>
                    <p>Listar todos los pedidos</p>
                    
                    <div class="endpoint">GET /api/pedidos/:id</div>
                    <p>Detalles de un pedido</p>
                </div>
            </div>

            <h2>Más Endpoints</h2>
            <div class="endpoint">GET /api/resumen</div>
            <div class="endpoint">GET /api/logs?limit=20</div>
            <div class="endpoint">POST /api/registrar-acceso</div>

            <h2>Documentación</h2>
            <p>Para más detalles, revisa el archivo <strong>README_NODE.md</strong></p>
        </div>
    </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Health check
app.get('/health', (req, res) => {
  sendSuccess(res, {
    status: 'ok',
    service: 'Node.js + Express + MySQL',
    uptime: process.uptime(),
  });
});

// Estado de la BD
app.get('/db-status', async (req, res) => {
  const connection = await getConnection();

  if (!connection) {
    return sendError(res, 'No se pudo conectar a la base de datos', 500);
  }

  try {
    // Obtener versión de MySQL
    const [versionResult] = await connection.query('SELECT VERSION() as version');
    const version = versionResult[0].version;

    // Obtener nombre de la BD
    const [dbResult] = await connection.query('SELECT DATABASE() as database_name');
    const dbName = dbResult[0].database_name;

    // Contar registros en tablas
    const tables = ['usuarios', 'productos', 'pedidos', 'categorias', 'detalles_pedidos', 'logs_acceso'];
    const counts = {};

    for (const table of tables) {
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      counts[table] = countResult[0].count;
    }

    connection.release();

    sendSuccess(res, {
      status: 'connected',
      mysql_version: version,
      database: dbName,
      connection_type: dbConfig.host.startsWith('10.') ? 'private_ip' : 'public_ip',
      connection_host: dbConfig.host,
      tables_count: counts,
    });
  } catch (error) {
    connection.release();
    sendError(res, 'Error al conectar a BD', 500, error);
  }
});

// ============================================================================
// RUTAS: USUARIOS
// ============================================================================

app.get('/api/usuarios', async (req, res) => {
  const connection = await getConnection();

  if (!connection) {
    return sendError(res, 'No se pudo conectar a la base de datos', 500);
  }

  try {
    const [usuarios] = await connection.query(
      'SELECT id, nombre, email, estado, fecha_registro FROM usuarios ORDER BY fecha_registro DESC'
    );
    connection.release();

    sendSuccess(res, {
      total: usuarios.length,
      usuarios,
    });
  } catch (error) {
    connection.release();
    sendError(res, 'Error al obtener usuarios', 500, error);
  }
});

app.get('/api/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const connection = await getConnection();

  if (!connection) {
    return sendError(res, 'No se pudo conectar a la base de datos', 500);
  }

  try {
    const [usuarios] = await connection.query(
      'SELECT id, nombre, email, estado, fecha_registro FROM usuarios WHERE id = ?',
      [id]
    );
    connection.release();

    if (usuarios.length === 0) {
      return sendError(res, 'Usuario no encontrado', 404);
    }

    sendSuccess(res, usuarios[0]);
  } catch (error) {
    connection.release();
    sendError(res, 'Error al obtener usuario', 500, error);
  }
});

// ============================================================================
// RUTAS: PRODUCTOS
// ============================================================================

app.get('/api/productos', async (req, res) => {
  const connection = await getConnection();

  if (!connection) {
    return sendError(res, 'No se pudo conectar a la base de datos', 500);
  }

  try {
    const [productos] = await connection.query(`
      SELECT 
        p.id, 
        p.nombre, 
        p.descripcion, 
        p.precio, 
        p.stock,
        c.nombre as categoria,
        p.estado
      FROM productos p
      INNER JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.nombre
    `);
    connection.release();

    sendSuccess(res, {
      total: productos.length,
      productos,
    });
  } catch (error) {
    connection.release();
    sendError(res, 'Error al obtener productos', 500, error);
  }
});

app.get('/api/categorias', async (req, res) => {
  const connection = await getConnection();

  if (!connection) {
    return sendError(res, 'No se pudo conectar a la base de datos', 500);
  }

  try {
    const [categorias] = await connection.query(
      'SELECT id, nombre, descripcion, activa FROM categorias ORDER BY nombre'
    );
    connection.release();

    sendSuccess(res, {
      total: categorias.length,
      categorias,
    });
  } catch (error) {
    connection.release();
    sendError(res, 'Error al obtener categorías', 500, error);
  }
});

// ============================================================================
// RUTAS: PEDIDOS
// ============================================================================

app.get('/api/pedidos', async (req, res) => {
  const connection = await getConnection();

  if (!connection) {
    return sendError(res, 'No se pudo conectar a la base de datos', 500);
  }

  try {
    const [pedidos] = await connection.query(`
      SELECT 
        p.id,
        p.numero_pedido,
        p.total,
        p.estado,
        p.fecha_pedido,
        u.nombre as cliente
      FROM pedidos p
      INNER JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.fecha_pedido DESC
    `);
    connection.release();

    sendSuccess(res, {
      total: pedidos.length,
      pedidos,
    });
  } catch (error) {
    connection.release();
    sendError(res, 'Error al obtener pedidos', 500, error);
  }
});

app.get('/api/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  const connection = await getConnection();

  if (!connection) {
    return sendError(res, 'No se pudo conectar a la base de datos', 500);
  }

  try {
    // Obtener información del pedido
    const [pedidos] = await connection.query(`
      SELECT 
        p.id,
        p.numero_pedido,
        p.total,
        p.estado,
        p.fecha_pedido,
        p.notas,
        u.nombre as cliente,
        u.email
      FROM pedidos p
      INNER JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (pedidos.length === 0) {
      connection.release();
      return sendError(res, 'Pedido no encontrado', 404);
    }

    // Obtener detalles del pedido
    const [detalles] = await connection.query(`
      SELECT 
        dp.id,
        dp.cantidad,
        dp.precio_unitario,
        dp.subtotal,
        pr.nombre as producto,
        pr.id as producto_id
      FROM detalles_pedidos dp
      INNER JOIN productos pr ON dp.producto_id = pr.id
      WHERE dp.pedido_id = ?
    `, [id]);

    connection.release();

    sendSuccess(res, {
      pedido: pedidos[0],
      detalles,
    });
  } catch (error) {
    connection.release();
    sendError(res, 'Error al obtener detalles del pedido', 500, error);
  }
});

// ============================================================================
// RUTAS: RESUMEN Y LOGS
// ============================================================================

app.get('/api/resumen', async (req, res) => {
  const connection = await getConnection();

  if (!connection) {
    return sendError(res, 'No se pudo conectar a la base de datos', 500);
  }

  try {
    // Estadísticas generales
    const [resumenResult] = await connection.query(`
      SELECT 
        (SELECT COUNT(*) FROM usuarios) as total_usuarios,
        (SELECT COUNT(*) FROM productos) as total_productos,
        (SELECT COUNT(*) FROM pedidos) as total_pedidos,
        (SELECT COUNT(*) FROM categorias) as total_categorias,
        (SELECT SUM(total) FROM pedidos WHERE estado = 'entregado') as ingresos_total,
        (SELECT AVG(total) FROM pedidos) as promedio_pedido
    `);

    const resumen = resumenResult[0];

    // Top 5 productos
    const [topProductos] = await connection.query(`
      SELECT 
        pr.nombre,
        COUNT(dp.id) as veces_vendido,
        SUM(dp.cantidad) as cantidad_total
      FROM detalles_pedidos dp
      INNER JOIN productos pr ON dp.producto_id = pr.id
      GROUP BY pr.nombre
      ORDER BY cantidad_total DESC
      LIMIT 5
    `);

    // Usuarios más activos
    const [usuariosActivos] = await connection.query(`
      SELECT 
        u.nombre,
        COUNT(p.id) as total_pedidos,
        SUM(p.total) as monto_total
      FROM usuarios u
      LEFT JOIN pedidos p ON u.id = p.usuario_id
      GROUP BY u.id, u.nombre
      ORDER BY total_pedidos DESC
      LIMIT 5
    `);

    connection.release();

    sendSuccess(res, {
      resumen,
      top_productos: topProductos,
      usuarios_activos: usuariosActivos,
    });
  } catch (error) {
    connection.release();
    sendError(res, 'Error al obtener resumen', 500, error);
  }
});

app.get('/api/logs', async (req, res) => {
  const limit = parseInt(req.query.limit || 20);
  const connection = await getConnection();

  if (!connection) {
    return sendError(res, 'No se pudo conectar a la base de datos', 500);
  }

  try {
    const [logs] = await connection.query(`
      SELECT 
        id,
        usuario_id,
        accion,
        recurso,
        ip_origen,
        resultado,
        fecha
      FROM logs_acceso
      ORDER BY fecha DESC
      LIMIT ?
    `, [limit]);
    connection.release();

    sendSuccess(res, {
      total: logs.length,
      logs,
    });
  } catch (error) {
    connection.release();
    sendError(res, 'Error al obtener logs', 500, error);
  }
});

app.post('/api/registrar-acceso', async (req, res) => {
  const { usuario_id, accion, recurso, resultado = 'exitoso' } = req.body;
  const ip_origen = req.ip || req.connection.remoteAddress;

  if (!usuario_id || !accion || !recurso) {
    return sendError(res, 'Faltan campos requeridos: usuario_id, accion, recurso', 400);
  }

  const connection = await getConnection();

  if (!connection) {
    return sendError(res, 'No se pudo conectar a la base de datos', 500);
  }

  try {
    await connection.query(
      'INSERT INTO logs_acceso (usuario_id, accion, recurso, ip_origen, resultado) VALUES (?, ?, ?, ?, ?)',
      [usuario_id, accion, recurso, ip_origen, resultado]
    );
    connection.release();

    sendSuccess(
      res,
      {
        status: 'success',
        message: 'Acceso registrado correctamente',
      },
      201
    );
  } catch (error) {
    connection.release();
    sendError(res, 'Error al registrar acceso', 500, error);
  }
});

// ============================================================================
// MANEJO DE ERRORES
// ============================================================================

app.use((req, res) => {
  sendError(res, 'Ruta no encontrada', 404);
});

app.use((err, req, res, next) => {
  sendError(res, 'Error interno del servidor', 500, err);
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║     🚀 App Node.js + Express + MySQL                  ║
║                                                       ║
║  Servidor iniciado en: http://0.0.0.0:${PORT}      ║
║  Base de datos: ${dbConfig.database}                       ║
║  Host: ${dbConfig.host}                            ║
║  Puerto BD: ${dbConfig.port}                              ║
╚═══════════════════════════════════════════════════════╝
  `);
});
