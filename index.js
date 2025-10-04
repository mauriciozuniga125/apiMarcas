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

// ✅ Función para validar que solo contiene letras y espacios
function validarSoloLetras(texto) {
  const regex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
  return regex.test(texto);
}

// ✅ Servir index.html desde la raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Endpoint GET para obtener marcas
app.get("/api/marcas", (req, res) => {
  db.query("SELECT id_marca AS id, nom_marca AS nombre FROM marcas", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener marcas" });
    }
    res.json(rows);
  });
});

// ✅ Endpoint POST para registrar nueva marca
app.post("/api/marcas", (req, res) => {
  const { nombre } = req.body;

  // Validar que se envió el nombre
  if (!nombre) {
    return res.status(400).json({ error: "El nombre de la marca es requerido" });
  }

  // Validar que solo contiene letras
  if (!validarSoloLetras(nombre)) {
    return res.status(400).json({ 
      error: "El nombre de la marca solo debe contener letras y espacios. No se permiten números ni caracteres especiales." 
    });
  }

  // Validar longitud mínima
  if (nombre.trim().length < 2) {
    return res.status(400).json({ 
      error: "El nombre de la marca debe tener al menos 2 caracteres" 
    });
  }

  // Primero obtenemos el máximo ID actual para incrementarlo
  db.query("SELECT MAX(id_marca) as maxId FROM marcas", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener el último ID" });
    }

    const nuevoId = (results[0].maxId || 0) + 1;

    // Insertar la nueva marca
    const query = "INSERT INTO marcas (id_marca, nom_marca) VALUES (?, ?)";
    db.query(query, [nuevoId, nombre.trim()], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al registrar la marca" });
      }

      res.status(201).json({
        mensaje: "Marca registrada con éxito",
        marca: {
          id: nuevoId,
          nombre: nombre.trim()
        }
      });
    });
  });
});

// ✅ Puerto dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
