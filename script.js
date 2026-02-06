// Dados dos produtos
const produtos = [
  {
    titulo: "Escova Sustentável",
    img: "escova.jpg",
    preco: "R$ 25,00",
    precoNum: 25.00,
    desc: "Produzida com bambu 100% reciclável e biodegradável. Ideal para quem busca um mundo melhor com pequenas ações todos os dias.",
    compra: "#",
  },
  {
    titulo: "Cadeira Sustentável",
    img: "cadeira.webp",
    preco: "R$ 120,90",
    precoNum: 120.90,
    desc: "Cadeira confortável feita com materiais de descarte reciclados. Resistente, estilosa e perfeita para ambientes internos e externos.",
    compra: "#",
  },
  {
    titulo: "Lixos para reciclagem",
    img: "lixos.webp",
    preco: "R$ 200,90",
    precoNum: 200.90,
    desc: "Kit com quatro lixeiras coloridas, ideais para separar e facilitar a coleta seletiva em casa, empresa ou condomínio.",
    compra: "#",
  },
  {
    titulo: "Lampada reciclagem",
    img: "lampada.jpg",
    preco: "R$ 80,90",
    precoNum: 80.90,
    desc: "Lâmpada feita com vidro e metal reciclados, baixo consumo e design moderno para iluminar seu espaço de forma consciente.",
    compra: "#",
  }
];

// Renderize cards com botões de adicionar/remover
const container = document.getElementById("produtos-container") || document.querySelector(".produtos-container");
container.innerHTML = "";
produtos.forEach((produto, i) => {
  const card = document.createElement("div");
  card.className = "produto";
  card.innerHTML = `
    <img src="${produto.img}" alt="${produto.titulo}" />
    <h3>${produto.titulo}</h3>
    <p class="preco">${produto.preco}</p>
    <div class="quantidade-controls">
      <button class="btn-menor" data-index="${i}">-</button>
      <span class="quantidade-produto" id="quantidade-${i}">0</span>
      <button class="btn-maior" data-index="${i}">+</button>
    </div>
    <button class="btn-adicionar-carrinho" data-index="${i}">Adicionar ao Carrinho</button>
  `;
  // Abrir modal do produto ao clicar na imagem/título
  card.querySelector('img').onclick = () => abrirModal(produto);
  card.querySelector('h3').onclick = () => abrirModal(produto);
  container.appendChild(card);
});

// Controle de quantidade local nos cards
let quantidades = Array(produtos.length).fill(0);

container.addEventListener('click', (e) => {
  const idx = e.target.dataset.index;
  if (e.target.classList.contains('btn-menor')) {
    if (quantidades[idx] > 0) quantidades[idx]--;
    document.getElementById("quantidade-"+idx).textContent = quantidades[idx];
  }
  if (e.target.classList.contains('btn-maior')) {
    quantidades[idx]++;
    document.getElementById("quantidade-"+idx).textContent = quantidades[idx];
  }
  if (e.target.classList.contains('btn-adicionar-carrinho')) {
    adicionarAoCarrinho(idx);
    quantidades[idx] = 0;
    document.getElementById("quantidade-"+idx).textContent = "0";
  }
});

// Carrinho
let carrinho = [];

function adicionarAoCarrinho(idx) {
  const qtd = quantidades[idx];
  if (qtd <= 0) return;
  const prod = produtos[idx];
  const existente = carrinho.find(item => item.idx == idx);
  if (existente) {
    existente.qtd += qtd;
  } else {
    carrinho.push({ idx, nome: prod.titulo, preco: prod.precoNum, qtd });
  }
  renderCarrinho();
}

function removerDoCarrinho(idx) {
  carrinho = carrinho.filter(item => item.idx != idx);
  renderCarrinho();
}

function alterarQtdCarrinho(idx, delta) {
  const existente = carrinho.find(item => item.idx == idx);
  if (!existente) return;
  existente.qtd += delta;
  if (existente.qtd <= 0) removerDoCarrinho(idx);
  renderCarrinho();
}

function renderCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  lista.innerHTML = "";
  let total = 0;

  if (carrinho.length === 0) {
    lista.innerHTML = "<p>Seu carrinho está vazio!</p>";
    document.getElementById("total-carrinho").innerHTML = "";
    return;
  }
  
  const tabela = document.createElement('table');
  tabela.className = "tabela-carrinho";
  tabela.innerHTML = `
    <thead>
      <tr>
        <th>Produto</th>
        <th>Qtde</th>
        <th>Unitário</th>
        <th>Total</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      ${
        carrinho.map(item => {
          const subtotal = item.preco * item.qtd;
          total += subtotal;
          return `
            <tr>
              <td>${item.nome}</td>
              <td>
                <button class="carrinho-menor" data-index="${item.idx}">-</button>
                ${item.qtd}
                <button class="carrinho-maior" data-index="${item.idx}">+</button>
              </td>
              <td>R$ ${item.preco.toFixed(2)}</td>
              <td>R$ ${subtotal.toFixed(2)}</td>
              <td><button class="carrinho-remover" data-index="${item.idx}">Remover</button></td>
            </tr>
          `;
        }).join('')
      }
    </tbody>
  `;
  lista.appendChild(tabela);
  document.getElementById("total-carrinho").innerHTML = `<strong>Total a pagar: R$ ${total.toFixed(2)}</strong>`;

  // Eventos dos botões do carrinho
  lista.querySelectorAll('.carrinho-menor').forEach(btn => {
    btn.onclick = () => alterarQtdCarrinho(btn.dataset.index, -1);
  });
  lista.querySelectorAll('.carrinho-maior').forEach(btn => {
    btn.onclick = () => alterarQtdCarrinho(btn.dataset.index, 1);
  });
  lista.querySelectorAll('.carrinho-remover').forEach(btn => {
    btn.onclick = () => removerDoCarrinho(btn.dataset.index);
  });
}

// Finalizar pedido
document.getElementById("finalizar-pedido").onclick = function() {
  if (carrinho.length === 0) {
    alert('O carrinho está vazio!');
    return;
  }
  document.getElementById("finalizacao-msg").textContent =
    "Pedido realizado com sucesso! Obrigado por escolher Reciclick 🌱";
  carrinho = [];
  renderCarrinho();
  setTimeout(() => {
    document.getElementById("finalizacao-msg").textContent = "";
  }, 3500);
};

// Modal de produtos
function abrirModal(produto) {
  document.getElementById("modal-img").src = produto.img;
  document.getElementById("modal-titulo").textContent = produto.titulo;
  document.getElementById("modal-desc").textContent = produto.desc;
  document.getElementById("modal-preco").textContent = produto.preco;
  document.getElementById("modal-btn-compra").href = produto.compra;
  document.getElementById("modal-produto").classList.add("aberto");
}

document.getElementById("fechar-modal").onclick = function() {
  document.getElementById("modal-produto").classList.remove("aberto");
};

// Fechar modal ao clicar fora
document.getElementById("modal-produto").onclick = function(e) {
  if (e.target === this) {
    this.classList.remove("aberto");
  }
};

// Formulário contato
const form = document.getElementById('form-contato');
const popup = document.getElementById('popup-enviado');
const fecharPopup = document.getElementById('fechar-popup');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  popup.classList.add('ativo');
  form.reset();
});
fecharPopup.onclick = function() {
  popup.classList.remove('ativo');
};
popup.onclick = function(e) {
  if (e.target === popup) popup.classList.remove('ativo');
};

renderCarrinho(); // Inicia carrinho vazio