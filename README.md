# 🏷️ API de Gestión de Marcas

API REST completa para gestión de marcas con Express.js y MySQL, desplegada en Render.

## 🚀 Características

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Base de datos MySQL en Railway
- ✅ Interfaz web responsive
- ✅ Despliegue automático en Render
- ✅ CORS habilitado
- ✅ Validación de datos

## 📚 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/marcas` | Obtener todas las marcas |
| GET | `/api/marcas/:id` | Obtener una marca por ID |
| POST | `/api/marcas` | Crear nueva marca |
| PUT | `/api/marcas/:id` | Actualizar marca existente |
| DELETE | `/api/marcas/:id` | Eliminar marca |

## 🛠️ Tecnologías

- **Backend:** Node.js, Express.js
- **Base de datos:** MySQL (Railway)
- **Frontend:** HTML5, CSS3, JavaScript
- **Despliegue:** Render
- **CORS:** Habilitado

## 🚀 Despliegue

1. **Render:** https://tu-app.onrender.com
2. **Health Check:** `/health`
3. **Ruta de prueba:** `/test`

## 📦 Instalación local

```bash
# Clonar repositorio
git clone <tu-repo>

# Instalar dependencias
npm install

# Ejecutar en desarrollo
node index.js
