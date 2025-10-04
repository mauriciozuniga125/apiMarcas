const express = require("express");

function marcaController(marcaService) {
  const router = express.Router();

  // GET - Consultar todas las marcas
  router.get("/", async (req, res) => {
    try {
      const marcas = await marcaService.obtenerMarcas();
      res.json(marcas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET - Consultar marca por ID
  router.get("/:id", async (req, res) => {
    try {
      const marca = await marcaService.obtenerMarcaPorId(req.params.id);
      if (!marca) {
        return res.status(404).json({ error: "Marca no encontrada" });
      }
      res.json(marca);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST - Crear nueva marca
  router.post("/", async (req, res) => {
    try {
      const { nombre } = req.body;
      if (!nombre) {
        return res.status(400).json({ error: "El nombre es requerido" });
      }
      const nuevaMarca = await marcaService.crearMarca(nombre);
      res.status(201).json(nuevaMarca);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PUT - Actualizar marca existente
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      if (!nombre) {
        return res.status(400).json({ error: "El nombre es requerido" });
      }
      const marcaActualizada = await marcaService.actualizarMarca(id, nombre);
      res.json(marcaActualizada);
    } catch (err) {
      if (err.message === "Marca no encontrada") {
        res.status(404).json({ error: err.message });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  });

  // DELETE - Eliminar marca
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await marcaService.eliminarMarca(id);
      res.json(resultado);
    } catch (err) {
      if (err.message === "Marca no encontrada") {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  });

  return router;
}

module.exports = marcaController;
