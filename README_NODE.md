# App Node.js + Express + MySQL en Google Cloud

## Características

✅ **Express.js** - Framework web rápido y minimalista
✅ **MySQL2/Promise** - Conexión con pools de conexión
✅ **CORS** - Control de acceso entre orígenes
✅ **Helmet** - Seguridad HTTP
✅ **Morgan** - Logging de HTTP
✅ **Docker** - Containerización
✅ **Google Cloud Ready** - Compatible con Cloud Run, App Engine, Compute Engine

---

## Instalación Rápida (Local)

### 1. Requisitos Previos

- **Node.js** 18.x o superior ([descargar](https://nodejs.org/))
- **npm** 9.x o superior
- **MySQL 8.0** accesible (IP privada o pública)
- **git** (opcional)

### 2. Clonar o descargar el proyecto

```bash
cd tu-proyecto
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.nodejs .env
# Edita .env con tus credenciales
```

### 4. Ejecutar localmente

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

Abre: **http://localhost:3000**

---

## Estructura del Proyecto

```
├── server.js              # Archivo principal
├── package.json           # Dependencias
├── .env                   # Variables de entorno (NO comitear)
├── .env.nodejs           # Plantilla .env
├── Dockerfile            # Para Docker
├── .dockerignore         # Archivos a ignorar en Docker
├── app.yaml              # Configuración Google Cloud
├── deploy.sh             # Script de despliegue
└── README_NODE.md        # Este archivo
```

---

## Variables de Entorno

```bash
DB_HOST=10.0.1.5              # IP de la BD
DB_PORT=3306                  # Puerto MySQL
DB_USER=appuser               # Usuario
DB_PASSWORD=appuserPassword!  # Contraseña
DB_NAME=app_db                # Base de datos
PORT=3000                     # Puerto de la app
NODE_ENV=development          # Ambiente (development/production)
```

---

## Endpoints REST

### 1. Health Check

```bash
GET /health
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "Node.js + Express + MySQL",
    "uptime": 123.456
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

### 2. Estado de la Base de Datos

```bash
GET /db-status
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "status": "connected",
    "mysql_version": "8.0.30",
    "database": "app_db",
    "connection_type": "private_ip",
    "connection_host": "10.0.1.5",
    "tables_count": {
      "usuarios": 5,
      "productos": 12,
      "pedidos": 5,
      "categorias": 5,
      "detalles_pedidos": 8,
      "logs_acceso": 6
    }
  }
}
```

---

### 3. Usuarios

#### Listar todos

```bash
GET /api/usuarios
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "usuarios": [
      {
        "id": 1,
        "nombre": "Juan García",
        "email": "juan@example.com",
        "estado": "activo",
        "fecha_registro": "2024-01-01T10:00:00.000Z"
      }
    ]
  }
}
```

#### Obtener uno

```bash
GET /api/usuario/1
```

---

### 4. Productos

#### Listar todos

```bash
GET /api/productos
```

#### Listar categorías

```bash
GET /api/categorias
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "categorias": [
      {
        "id": 1,
        "nombre": "Electrónica",
        "descripcion": "Productos electrónicos",
        "activa": true
      }
    ]
  }
}
```

---

### 5. Pedidos

#### Listar todos

```bash
GET /api/pedidos
```

#### Detalles de un pedido

```bash
GET /api/pedidos/1
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "pedido": {
      "id": 1,
      "numero_pedido": "PED-20240101-001",
      "total": 999.99,
      "estado": "entregado",
      "cliente": "Juan García"
    },
    "detalles": [
      {
        "cantidad": 1,
        "precio_unitario": 899.99,
        "subtotal": 899.99,
        "producto": "Laptop HP"
      }
    ]
  }
}
```

---

### 6. Resumen Estadístico

```bash
GET /api/resumen
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "resumen": {
      "total_usuarios": 5,
      "total_productos": 12,
      "total_pedidos": 5,
      "ingresos_total": 1749.95,
      "promedio_pedido": 349.99
    },
    "top_productos": [
      {
        "nombre": "Laptop HP",
        "veces_vendido": 1,
        "cantidad_total": 1
      }
    ],
    "usuarios_activos": [
      {
        "nombre": "Juan García",
        "total_pedidos": 2,
        "monto_total": 1124.97
      }
    ]
  }
}
```

---

### 7. Logs de Acceso

#### Listar logs

```bash
GET /api/logs?limit=20
```

#### Registrar acceso

```bash
POST /api/registrar-acceso
Content-Type: application/json

{
  "usuario_id": 1,
  "accion": "LOGIN",
  "recurso": "auth",
  "resultado": "exitoso"
}
```

---

## Ejemplos de Cliente

### cURL

```bash
# Obtener usuarios
curl -X GET http://localhost:3000/api/usuarios

# Obtener estado de BD
curl -X GET http://localhost:3000/db-status

# Registrar acceso
curl -X POST http://localhost:3000/api/registrar-acceso \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "accion": "VIEW",
    "recurso": "productos"
  }'
```

### JavaScript/Fetch

```javascript
// Obtener usuarios
fetch('http://localhost:3000/api/usuarios')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Registrar acceso
fetch('http://localhost:3000/api/registrar-acceso', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    usuario_id: 1,
    accion: 'LOGIN',
    recurso: 'auth'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Node.js/Fetch

```javascript
import fetch from 'node-fetch';

const response = await fetch('http://localhost:3000/api/usuarios');
const data = await response.json();
console.log(data);
```

### Axios

```javascript
import axios from 'axios';

const config = {
  baseURL: 'http://localhost:3000',
  timeout: 5000
};

const api = axios.create(config);

// GET
api.get('/api/usuarios')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));

// POST
api.post('/api/registrar-acceso', {
  usuario_id: 1,
  accion: 'LOGIN',
  recurso: 'auth'
})
  .then(res => console.log(res.data));
```

---

## Despliegue en Google Cloud

### Opción 1: Cloud Run (Recomendado)

**Ventajas:** Sin servidor, escala automática, paga solo por uso

```bash
# 1. Autenticar con GCP
gcloud auth login
gcloud config set project TU_PROYECTO

# 2. Construir y desplegar
gcloud run deploy mi-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --set-env-vars DB_HOST=10.0.1.5,DB_USER=appuser,DB_PASSWORD=tuPassword,DB_NAME=app_db

# 3. Obtener URL
gcloud run services describe mi-app --platform managed --region us-central1
```

### Opción 2: App Engine

```bash
# Edita app.yaml con tus variables

gcloud config set project TU_PROYECTO
gcloud app deploy app.yaml
gcloud app browse
```

### Opción 3: Compute Engine (VM)

```bash
# 1. Crear VM
gcloud compute instances create mi-vm \
  --zone us-central1-a \
  --image-family debian-11 \
  --image-project debian-cloud \
  --machine-type e2-micro

# 2. Conectar SSH
gcloud compute ssh mi-vm --zone us-central1-a

# 3. En la VM:
curl -sL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get install nodejs git
git clone tu-repo.git
cd tu-repo
npm install
npm start
```

### Opción 4: Docker Local

```bash
# Construir imagen
docker build -t mi-app:latest .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e DB_HOST=10.0.1.5 \
  -e DB_USER=appuser \
  -e DB_PASSWORD=tuPassword \
  -e DB_NAME=app_db \
  mi-app:latest

# Subir a Container Registry
docker tag mi-app:latest gcr.io/TU_PROYECTO/mi-app:latest
docker push gcr.io/TU_PROYECTO/mi-app:latest
```

---

## Seguridad en Producción

### 1. Usar Google Secret Manager

```bash
# Crear secreto
echo -n "tuPassword123" | gcloud secrets create db-password --data-file=-

# Referenciar en Cloud Run
gcloud run deploy mi-app \
  --update-secrets DB_PASSWORD=db-password:latest
```

### 2. Usar Cloud SQL Proxy

```bash
# Instalar Cloud SQL Proxy
curl -o cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64
chmod +x cloud_sql_proxy

# Ejecutar proxy
./cloud_sql_proxy -instances=PROYECTO:REGION:INSTANCIA=tcp:3306

# Conectar a través del proxy
# DB_HOST=127.0.0.1
```

### 3. Firewall de Google Cloud

```bash
# Permitir tráfico desde Cloud Run
gcloud compute firewall-rules create allow-cloud-run \
  --allow=tcp:3306 \
  --source-tags=cloud-run \
  --network=shared-vpc
```

---

## Monitoreo

### Logs en Cloud Logging

```bash
# Ver logs en tiempo real
gcloud logging read "resource.type=cloud_run_revision" --limit 50 --format=json
```

### Métricas

```bash
# Ver métricas de Cloud Run
gcloud monitoring time-series list \
  --filter='resource.type="cloud_run_revision"'
```

---

## Solución de Problemas

### Error: "Cannot find module"

```bash
npm install
npm ci  # Usar en CI/CD
```

### Error: "Connection timeout"

```bash
# Verificar firewall
gcloud compute firewall-rules list --filter="network:shared-vpc"

# Verificar IP privada
gcloud sql instances describe prueba-mysql --format="value(ipAddresses[])"
```

### Error: "Access denied for user"

```bash
# Verificar credenciales en .env
cat .env

# Verificar usuario en BD
mysql -h 10.0.1.5 -u root -p
SELECT User FROM mysql.user;
```

### Error: "Pool is closed"

```bash
# Usar --max-pool-size en configuración
# Aumentar timeout en requests largos
# Implementar connection pooling
```

---

## Performance

### Optimizaciones Implementadas

✅ Pool de conexiones MySQL
✅ Middleware de compresión
✅ Helmet para seguridad headers
✅ CORS controlado
✅ Morgan para logging eficiente

### Recomendaciones

1. **Caché**: Agregar Redis o Memcached
2. **CDN**: Usar Cloud CDN para static files
3. **Database**: Crear índices en columnas usadas frecuentemente
4. **Monitoring**: Usar Cloud Trace para profiling

---

## Scaling

### Vertical (Más recursos)

```bash
gcloud run deploy mi-app \
  --memory 1Gi \
  --cpu 2
```

### Horizontal (Más instancias)

```bash
gcloud run deploy mi-app \
  --max-instances 100
```

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev              # Con auto-reload

# Producción
npm start                # Inicia servidor

# Instalación
npm install              # Instalar dependencias
npm ci                   # CI/CD install

# Docker
docker build -t app .    # Construir imagen
docker run -p 3000:3000 app  # Ejecutar

# Google Cloud
gcloud auth login        # Autenticación
gcloud config list       # Ver configuración
gcloud projects list     # Ver proyectos
```

---

## Estructura de Respuestas

**Success (2xx)**
```json
{
  "success": true,
  "data": { /* resultado */ },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Error (4xx/5xx)**
```json
{
  "success": false,
  "error": "Mensaje de error",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

## Recursos Útiles

- [Express.js Docs](https://expressjs.com/)
- [MySQL2 Docs](https://github.com/sidorares/node-mysql2)
- [Google Cloud Run Docs](https://cloud.google.com/run/docs)
- [Google Cloud SQL Docs](https://cloud.google.com/sql/docs)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

## Licencia

MIT

## Soporte

Para problemas o preguntas, abre un issue en GitHub.
