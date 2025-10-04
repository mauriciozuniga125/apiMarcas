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
  db.query("SELECT id_marca AS id, nom_marca AS nombre FROM marcas ORDER BY id_marca", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener marcas" });
    }
    res.json(rows);
  });
});

// ✅ Endpoint GET para obtener una marca específica
app.get("/api/marcas/:id", (req, res) => {
  const marcaId = req.params.id;
  
  db.query("SELECT id_marca AS id, nom_marca AS nombre FROM marcas WHERE id_marca = ?", [marcaId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener la marca" });
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Marca no encontrada" });
    }
    
    res.json(rows[0]);
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

// ✅ Endpoint PUT para actualizar una marca
app.put("/api/marcas/:id", (req, res) => {
  const marcaId = req.params.id;
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

  // Verificar si la marca existe
  db.query("SELECT id_marca FROM marcas WHERE id_marca = ?", [marcaId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al verificar la marca" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Marca no encontrada" });
    }

    // Actualizar la marca
    const query = "UPDATE marcas SET nom_marca = ? WHERE id_marca = ?";
    db.query(query, [nombre.trim(), marcaId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al actualizar la marca" });
      }

      res.json({
        mensaje: "Marca actualizada con éxito",
        marca: {
          id: parseInt(marcaId),
          nombre: nombre.trim()
        }
      });
    });
  });
});

// ✅ Endpoint DELETE para eliminar una marca
app.delete("/api/marcas/:id", (req, res) => {
  const marcaId = req.params.id;

  // Verificar si la marca existe
  db.query("SELECT id_marca FROM marcas WHERE id_marca = ?", [marcaId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al verificar la marca" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Marca no encontrada" });
    }

    // Eliminar la marca
    const query = "DELETE FROM marcas WHERE id_marca = ?";
    db.query(query, [marcaId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al eliminar la marca" });
      }

      res.json({
        mensaje: "Marca eliminada con éxito",
        marcaId: parseInt(marcaId)
      });
    });
  });
});

// ✅ Puerto dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
