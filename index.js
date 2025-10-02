const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config(); // para usar variables de entorno (.env)

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Servir archivos estáticos (tu HTML, CSS, JS) desde /public
app.use(express.static(path.join(__dirname, "public")));

// ✅ Conexión a la base de datos con variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST || "caboose.proxy.rlwy.net",
  port: process.env.DB_PORT || 43751,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "gzGmMybpEUnAsvoNuOeUWzefhUiDDjlN",
  database: process.env.DB_NAME || "railway"
});

// Probar conexión al iniciar
db.connect(err => {
  if (err) {
    console.error("❌ Error conectando a la BD:", err.message);
  } else {
    console.log("✅ Conectado a MySQL en Railway");
  }
});

// ✅ Endpoint para marcas
app.get("/api/marcas", (req, res) => {
  db.query("SELECT id_marca AS id, nom_marca AS nombre FROM marcas", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener marcas" });
    }
    res.json(rows);
  });
});

// ✅ Render usará este puerto automáticamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
