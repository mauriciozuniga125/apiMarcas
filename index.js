const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err.message);
  } else {
    console.log("✅ Conectado a MySQL en Railway");
  }
});

// ✅ Servir index.html desde la raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
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

// ✅ Puerto dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
