const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Conexión a base de datos
const db = mysql.createConnection({
  host: "caboose.proxy.rlwy.net",
  port: 43751,
  user: "root",
  password: "gzGmMybpEUnAsvoNuOeUWzefhUiDDjlN",
  database: "railway"
});

db.connect(err => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err.message);
    return;
  }
  console.log("✅ Conectado a MySQL en Railway");
});

// 1. GET TODAS LAS MARCAS
app.get("/api/marcas", (req, res) => {
  console.log("🔍 GET /api/marcas");
  
  const sql = "SELECT id_marca AS id, nom_marca AS nombre FROM marcas";
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Error en GET:", err);
      return res.status(500).json({ error: "Error al obtener marcas" });
    }
    console.log(`✅ GET: ${rows.length} marcas`);
    res.json(rows);
  });
});

// 2. GET MARCA POR ID
app.get("/api/marcas/:id", (req, res) => {
  const id = req.params.id;
  console.log(`🔍 GET /api/marcas/${id}`);
  
  const sql = "SELECT id_marca AS id, nom_marca AS nombre FROM marcas WHERE id_marca = ?";
  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("❌ Error en GET por ID:", err);
      return res.status(500).json({ error: "Error al obtener marca" });
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Marca no encontrada" });
    }
    
    console.log(`✅ GET por ID:`, rows[0]);
    res.json(rows[0]);
  });
});

// 3. POST CREAR MARCA
app.post("/api/marcas", (req, res) => {
  console.log('📨 POST /api/marcas - Body:', req.body);
  
  let { nombre } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: "El nombre es requerido" });
  }
  
  nombre = String(nombre).trim();
  
  if (nombre === "") {
    return res.status(400).json({ error: "El nombre no puede estar vacío" });
  }
  
  const sql = "INSERT INTO marcas (nom_marca) VALUES (?)";
  db.query(sql, [nombre], (err, result) => {
    if (err) {
      console.error("❌ Error en POST:", err);
      return res.status(500).json({ error: "Error en base de datos" });
    }
    
    console.log(`✅ POST: Marca creada ID: ${result.insertId}`);
    res.json({ 
      id: result.insertId, 
      nombre: nombre
    });
  });
});

// 4. PUT ACTUALIZAR MARCA
app.put("/api/marcas/:id", (req, res) => {
  const id = req.params.id;
  console.log(`✏️ PUT /api/marcas/${id} - Body:`, req.body);
  
  let { nombre } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: "Nombre es requerido" });
  }
  
  nombre = String(nombre).trim();
  
  if (nombre === "") {
    return res.status(400).json({ error: "El nombre no puede estar vacío" });
  }
  
  const sql = "UPDATE marcas SET nom_marca = ? WHERE id_marca = ?";
  db.query(sql, [nombre, id], (err, result) => {
    if (err) {
      console.error("❌ Error en PUT:", err);
      return res.status(500).json({ error: "Error en base de datos" });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Marca no encontrada" });
    }
    
    console.log(`✅ PUT: Marca ${id} actualizada`);
    res.json({ 
      id: parseInt(id), 
      nombre: nombre
    });
  });
});

// 5. DELETE ELIMINAR MARCA
app.delete("/api/marcas/:id", (req, res) => {
  const id = req.params.id;
  console.log(`🗑️ DELETE /api/marcas/${id}`);

  const sql = "DELETE FROM marcas WHERE id_marca = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error en DELETE:", err);
      return res.status(500).json({ error: "Error en base de datos" });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Marca no encontrada" });
    }
    
    console.log(`✅ DELETE: Marca ${id} eliminada`);
    res.json({ 
      mensaje: "Marca eliminada correctamente", 
      id: parseInt(id) 
    });
  });
});

// Servir interfaz web
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Health check para Render
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "API de Marcas funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba
app.get("/test", (req, res) => {
  res.json({ 
    message: "🚀 API de Marcas desplegada en Render",
    endpoints: {
      "GET /api/marcas": "Obtener todas las marcas",
      "GET /api/marcas/:id": "Obtener una marca por ID",
      "POST /api/marcas": "Crear nueva marca",
      "PUT /api/marcas/:id": "Actualizar marca",
      "DELETE /api/marcas/:id": "Eliminar marca"
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("❌ Error global:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   GET    /api/marcas`);
  console.log(`   GET    /api/marcas/:id`);
  console.log(`   POST   /api/marcas`);
  console.log(`   PUT    /api/marcas/:id`);
  console.log(`   DELETE /api/marcas/:id`);
  console.log(`   GET    /health (Health Check)`);
  console.log(`   GET    /test (Ruta de prueba)`);
});
