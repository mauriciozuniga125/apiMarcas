const mysql = require('mysql2/promise');
const Marca = require('../domain/marca');

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
      const [rows] = await this.pool.query('SELECT id_marca, nom_marca FROM marcas');
      return rows.map(row => new Marca(row.id_marca, row.nom_marca));
    } catch (err) {
      console.error("❌ Error en la consulta:", err);
      throw err;
    }
  }
}

module.exports = MarcaRepository;
