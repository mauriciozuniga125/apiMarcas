const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "caboose.proxy.rlwy.net",
  port: 43751,
  user: "root",
  password: "gzGmMybpEUnAsvoNuOeUWzefhUiDDjlN",
  database: "railway"
});

module.exports = pool;
