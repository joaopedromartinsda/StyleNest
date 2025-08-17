// ---------------------------
// 🛒 CARRINHO
// ---------------------------
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Atualiza contador no ícone do carrinho
function atualizarCarrinho() {
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    cartCount.textContent = carrinho.length;
  }
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Adiciona produto ao carrinho
function adicionarAoCarrinho(produto) {
  carrinho.push(produto);
  atualizarCarrinho();
  alert(`${produto.nome} adicionado ao carrinho!`);
}

// Remove produto do carrinho (pelo índice)
function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

// Adiciona evento de clique nos botões de comprar/adicionar
document.querySelectorAll(".botao-comprar, .botao-adicionar").forEach((botao) => {
  botao.addEventListener("click", function () {
    const produto = {
      nome: this.dataset.nome || "Produto sem nome",
      preco: this.dataset.preco || "0.00",
      imagem: this.dataset.imagem || "",
    };
    adicionarAoCarrinho(produto);
  });
});

// Atualiza contador do carrinho ao carregar
document.addEventListener("DOMContentLoaded", atualizarCarrinho);

// ---------------------------
// 🔐 LOGIN & CADASTRO (Modais)
// ---------------------------
const modalLogin = document.getElementById("modal-login");
const modalRegister = document.getElementById("modal-register");
const btnLogin = document.getElementById("btn-login");
const btnRegister = document.getElementById("btn-register");
const btnsFechar = document.querySelectorAll(".btn-fechar");

// Abrir login
if (btnLogin) {
  btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    modalLogin.style.display = "flex";
  });
}

// Abrir cadastro
if (btnRegister) {
  btnRegister.addEventListener("click", (e) => {
    e.preventDefault();
    modalRegister.style.display = "flex";
  });
}

// Fechar modais
btnsFechar.forEach((btn) => {
  btn.addEventListener("click", () => {
    modalLogin.style.display = "none";
    modalRegister.style.display = "none";
  });
});

// Fechar clicando fora do modal
window.addEventListener("click", (e) => {
  if (e.target === modalLogin) modalLogin.style.display = "none";
  if (e.target === modalRegister) modalRegister.style.display = "none";
});

// ---------------------------
// 📤 SUBMISSÃO DE FORMULÁRIOS (com backend)
// ---------------------------

// LOGIN
const formLogin = document.getElementById("form-login");
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    try {
      const resposta = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("✅ Login bem-sucedido!");
        modalLogin.style.display = "none";
        localStorage.setItem("usuario", JSON.stringify(dados.usuario));
      } else {
        alert("❌ " + (dados.erro || "Erro ao logar"));
      }
    } catch (erro) {
      alert("Erro de conexão com o servidor");
    }
  });
}

// CADASTRO
const formRegister = document.getElementById("form-register");
if (formRegister) {
  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("register-nome").value;
    const email = document.getElementById("register-email").value;
    const senha = document.getElementById("register-senha").value;
    const confirmar = document.getElementById("register-confirmar").value;

    if (senha !== confirmar) {
      alert("❌ As senhas não conferem!");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:3000/api/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("✅ Cadastro realizado com sucesso!");
        modalRegister.style.display = "none";
      } else {
        alert("❌ " + (dados.erro || "Erro ao cadastrar"));
      }
    } catch (erro) {
      alert("Erro de conexão com o servidor");
    }
  });
}
