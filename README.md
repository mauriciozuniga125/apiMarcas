📋 Documentación - API de Gestión de Marcas
📖 Descripción
Sistema completo para la gestión de marcas que permite consultar y registrar nuevas marcas mediante una API RESTful con interfaz web.

🚀 Características
✅ CRUD Completo: Consulta y registro de marcas

✅ Validaciones: Solo permite letras, vocales acentuadas y espacios

✅ Interfaz Web: Frontend responsive y amigable

✅ Base de Datos: MySQL con conexión segura

✅ API RESTful: Endpoints bien estructurados

🏗️ Arquitectura del Proyecto
text
APIMARCAS-MAIN/
├── 📁 src/
│   ├── 📁 application/
│   │   └── marcaService.js
│   ├── 📁 domain/
│   │   └── marca.js
│   ├── 📁 infrastructure/
│   │   ├── db.js
│   │   └── marcaRepository.js
│   └── 📁 interfaces/
│       └── marcaController.js
├── 📁 env/
├── 📄 index.html
├── 📄 index.js
├── 📄 package.json
└── 📄 package-lock.json
📋 Requisitos Previos
Software Requerido
Node.js (v14 o superior)

npm (v6 o superior)

MySQL (v5.7 o superior)

Dependencias del Proyecto
json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3"
}
⚙️ Configuración e Instalación
1. Clonar o Descargar el Proyecto
bash
# Si tienes el código fuente
cd APIMARCAS-MAIN
2. Instalar Dependencias
bash
npm install
3. Configurar Variables de Entorno
Crear archivo .env en la raíz del proyecto:

env
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=43751
DB_USER=root
DB_PASS=gzGmMybpEUnAsvoNuOeUWzefhUiDDjlN
DB_NAME=railway
PORT=3000
4. Configurar Base de Datos
Ejecutar el siguiente script SQL en MySQL:

sql
CREATE DATABASE IF NOT EXISTS railway;

USE railway;

CREATE TABLE marcas (
  id_marca INT PRIMARY KEY,
  nom_marca VARCHAR(255) NOT NULL
);

-- Opcional: Insertar datos de ejemplo
INSERT INTO marcas (id_marca, nom_marca) VALUES 
(1, 'Nike'),
(2, 'Adidas'),
(3, 'Puma');
5. Ejecutar la Aplicación
bash
# Modo desarrollo
npm start

# O directamente con Node
node index.js
🌐 API Endpoints
🔹 Obtener Todas las Marcas
GET /api/marcas

Respuesta Exitosa:

json
[
  {
    "id": 1,
    "nombre": "Nike"
  },
  {
    "id": 2,
    "nombre": "Adidas"
  }
]
🔹 Registrar Nueva Marca
POST /api/marcas

Body:

json
{
  "nombre": "Nueva Marca"
}
Respuesta Exitosa:

json
{
  "mensaje": "Marca registrada con éxito",
  "marca": {
    "id": 4,
    "nombre": "Nueva Marca"
  }
}
Respuesta de Error:

json
{
  "error": "El nombre de la marca solo debe contener letras y espacios."
}
🛡️ Validaciones
Backend Validations
✅ Solo letras: Permite A-Z, a-z, vocales acentuadas, Ñ/ñ y espacios

✅ Longitud mínima: 2 caracteres

✅ Campo requerido: Nombre no puede estar vacío

✅ ID automático: Generación incremental automática

Frontend Validations
✅ Validación en tiempo real mientras el usuario escribe

✅ Feedback visual inmediato

✅ Botón deshabilitado cuando hay errores

✅ Mensajes de error claros y específicos

Expresión Regular de Validación
javascript
/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/
🎨 Interfaz Web
Características de la UI
Diseño Responsive: Adaptable a diferentes dispositivos

Validación Visual: Campos con estados de error/éxito

Animaciones: Transiciones suaves y feedback visual

Notificaciones: Mensajes claros de éxito y error

Secciones Principales
📝 Registro de Marcas

Campo de texto con validación en tiempo real

Botón de registro con estados interactivos

Mensajes de resultado

🔍 Selección de Marcas

Dropdown con marcas existentes

Visualización de selección actual

Actualización automática tras nuevos registros

🗃️ Estructura de la Base de Datos
Tabla: marcas
Campo	Tipo	Descripción
id_marca	INT	ID único (Primary Key)
nom_marca	VARCHAR(255)	Nombre de la marca
🔧 Estructura del Código
Capa de Dominio
javascript
// domain/marca.js
class Marca {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }
}
Capa de Aplicación
javascript
// application/marcaService.js
class MarcaService {
  async obtenerMarcas() {
    return await this.marcaRepository.findAll();
  }
}
Capa de Infraestructura
javascript
// infrastructure/marcaRepository.js
class MarcaRepository {
  async findAll() {
    // Consulta a la base de datos
  }
}
🚨 Manejo de Erros
Códigos de Estado HTTP
200 ✅ - Éxito en la consulta

201 ✅ - Recurso creado exitosamente

400 ❌ - Error de validación en los datos

500 ❌ - Error interno del servidor

Mensajes de Error Comunes
"El nombre de la marca es requerido"

"El nombre de la marca solo debe contener letras y espacios."

"Error al conectar con el servidor"

"Error al registrar la marca"
