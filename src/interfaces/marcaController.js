// src/infrastructure/marcaRepository.js
const mysql = require("mysql2/promise");

class MarcaRepository {
  constructor() {
    this.pool = mysql.createPool({
      host: "caboose.proxy.rlwy.net",
      port: 43751,   // usa el puerto de tu DB en Railway
      user: "root",
      password: "gzGmMybpEUnAsvoNuOeUWzefhUjDjIN", // <-- tu pass
      database: "railway"
    });
  }

  async findAll() {
    const [rows] = await this.pool.query("SELECT id_marca, nombre_marca FROM marcas");
    return rows;
  }
}

module.exports = MarcaRepository;
