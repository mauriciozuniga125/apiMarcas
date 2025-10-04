const mysql = require('mysql2/promise');
const Marca = require('./domanin/marca');

class MarcaRepository {
  constructor() {
    this.pool = mysql.createPool({
      host: "caboose.proxy.rlwy.net",
      port: 43751,
      user: "root",
      password: "gzGmMybpEUnAsvoNuOeUWzefhUiDDjlN",
      database: "railway"
    });
  }

  async findAll() {
    try {
      console.log("🔍 Ejecutando query: SELECT id_marca AS id, nom_marca AS nombre FROM marcas");
      
      const [rows] = await this.pool.query('SELECT id_marca AS id, nom_marca AS nombre FROM marcas');
      
      console.log(`📊 Resultados obtenidos: ${rows.length} marcas`);
      console.log("📊 Marcas:", rows);
      
      return rows.map(row => new Marca(row.id, row.nombre));
    } catch (err) {
      console.error("❌ Error en la consulta:", err);
      throw err;
    }
  }

  async findById(id) {
    try {
      const [rows] = await this.pool.query(
        'SELECT id_marca AS id, nom_marca AS nombre FROM marcas WHERE id_marca = ?', 
        [id]
      );
      if (rows.length === 0) return null;
      return new Marca(rows[0].id, rows[0].nombre);
    } catch (err) {
      console.error("❌ Error al buscar marca:", err);
      throw err;
    }
  }

  async create(nombre) {
    try {
      const [result] = await this.pool.query(
        'INSERT INTO marcas (nom_marca) VALUES (?)', 
        [nombre]
      );
      return new Marca(result.insertId, nombre);
    } catch (err) {
      console.error("❌ Error al crear marca:", err);
      throw err;
    }
  }

  async update(id, nombre) {
    try {
      const [result] = await this.pool.query(
        'UPDATE marcas SET nom_marca = ? WHERE id_marca = ?', 
        [nombre, id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Marca no encontrada");
      }
      return new Marca(parseInt(id), nombre);
    } catch (err) {
      console.error("❌ Error al actualizar marca:", err);
      throw err;
    }
  }

  async delete(id) {
    try {
      console.log(`🔍 Intentando eliminar marca ID: ${id}`);
      
      const [result] = await this.pool.query(
        'DELETE FROM marcas WHERE id_marca = ?', 
        [id]
      );
      
      console.log(`📊 Filas afectadas: ${result.affectedRows}`);
      
      if (result.affectedRows === 0) {
        // Ver qué marcas existen realmente
        const [allMarcas] = await this.pool.query('SELECT id_marca, nom_marca FROM marcas');
        console.log(`📊 Marcas existentes en BD:`, allMarcas);
        throw new Error("Marca no encontrada");
      }
      
      return { mensaje: "Marca eliminada correctamente", id: parseInt(id) };
    } catch (err) {
      console.error("❌ Error al eliminar marca:", err);
      throw err;
    }
  }
}

module.exports = MarcaRepository;
