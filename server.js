const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const port = 3000;

// Configurações
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com PostgreSQL (ajusta se precisar)
const pool = new Pool({
  user: "postgres",       // teu usuário do pgAdmin
  host: "localhost",
  database: "TCC",  // nome do banco
  password: "P@ssW0rd",   // tua senha do postgres
  port: 5432,
});

// Rota inicial
app.get("/", (req, res) => {
  res.send("Servidor rodando! 🚀");
});

// -------------------
// 📌 ROTA CADASTRO
// -------------------
app.post("/api/cadastrar", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos!" });
  }

  try {
    // Verifica se já existe usuário com o mesmo email
    const existe = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ erro: "Email já cadastrado!" });
    }

    // Criptografa senha
    const hash = await bcrypt.hash(senha, 10);

    // Insere no banco
    await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)",
      [nome, email, hash]
    );

    res.json({ mensagem: "Usuário cadastrado com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor ao cadastrar." });
  }
});

// -------------------
// 📌 ROTA LOGIN
// -------------------
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos!" });
  }

  try {
    const resultado = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: "Email não encontrado!" });
    }

    const usuario = resultado.rows[0];

    // Verifica a senha com bcrypt
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta!" });
    }

    res.json({ mensagem: "Login bem-sucedido!", usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor ao logar." });
  }
});

// -------------------
// Inicia servidor
// -------------------
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
