const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",       // coloca o mesmo que você usa no pgAdmin
  host: "localhost",
  database: "TCC",  // teu banco
  password: "P@ssW0rd",  // mesma senha que funciona no pgAdmin
  port: 5432,
});

async function testar() {
  try {
    const res = await pool.query("SELECT NOW() as agora;");
    console.log("✅ Conexão OK! Hora no banco:", res.rows[0].agora);
  } catch (err) {
    console.error("❌ Erro na conexão:", err.message);
  } finally {
    pool.end();
  }
}

testar();
