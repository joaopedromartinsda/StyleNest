document.addEventListener('DOMContentLoaded', () => {
  const botoesAdicionar = document.querySelectorAll('.botao-adicionar');
  const botoesComprar = document.querySelectorAll('.botao-comprar');
  const listaCarrinho = document.getElementById('lista-carrinho');
  const totalCarrinho = document.getElementById('total-carrinho');

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  function atualizarCarrinho() {
    listaCarrinho.innerHTML = '';
    let total = 0;

    carrinho.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = `${item.nome} - ${item.preco}`;

      const botaoRemover = document.createElement('button');
      botaoRemover.textContent = 'Remover';
      botaoRemover.style.marginLeft = '10px';
      botaoRemover.addEventListener('click', () => {
        carrinho.splice(index, 1);
        salvarCarrinho();
        atualizarCarrinho();
      });

      li.appendChild(botaoRemover);
      listaCarrinho.appendChild(li);

      total += parseFloat(item.preco.replace('R$', '').replace(',', '.'));
    });

    totalCarrinho.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }

  botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', () => {
      const produto = botao.parentElement;
      const nome = produto.querySelector('h2').textContent;
      const preco = produto.querySelector('.preco').textContent;

      carrinho.push({ nome, preco });
      salvarCarrinho();
      atualizarCarrinho();
    });
  });

  botoesComprar.forEach(botao => {
    botao.addEventListener('click', () => {
      const produto = botao.parentElement;
      const nome = produto.querySelector('h2').textContent;
      const preco = produto.querySelector('.preco').textContent;

      // Simula compra imediata: salva no carrinho e redireciona
      carrinho.push({ nome, preco });
      salvarCarrinho();
      window.location.href = 'checkout.html'; // substitua com sua página real
    });
  });

  atualizarCarrinho();
});