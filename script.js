let categorias = JSON.parse(localStorage.getItem("categorias")) || {};
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

function salvar() {
  localStorage.setItem("categorias", JSON.stringify(categorias));
  localStorage.setItem("vendas", JSON.stringify(vendas));
}

function atualizarCategorias() {
  const lista = document.getElementById("lista-categorias");
  const formVenda = document.getElementById("form-venda");
  lista.innerHTML = "";
  formVenda.innerHTML = "";

  for (let nome in categorias) {
    // mostrar categorias salvas
    const li = document.createElement("li");
    li.textContent = `${nome} - R$${categorias[nome].toFixed(2)}`;
    lista.appendChild(li);

    // gerar inputs para registrar venda
    const label = document.createElement("label");
    label.innerText = `${nome} (R$${categorias[nome].toFixed(2)})`;
    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.value = 0;
    input.dataset.nome = nome;
    input.oninput = calcularTotalVenda;

    formVenda.appendChild(label);
    formVenda.appendChild(input);
  }
}

function adicionarCategoria() {
  const nome = document.getElementById("cat-nome").value.trim();
  const valor = parseFloat(document.getElementById("cat-valor").value);

  if (!nome || isNaN(valor) || valor <= 0) {
    alert("Preencha nome e valor corretamente.");
    return;
  }

  categorias[nome] = valor;
  salvar();
  atualizarCategorias();

  document.getElementById("cat-nome").value = "";
  document.getElementById("cat-valor").value = "";
}

function calcularTotalVenda() {
  let total = 0;
  const inputs = document.querySelectorAll("#form-venda input");

  inputs.forEach(input => {
    const qtd = parseInt(input.value) || 0;
    const nome = input.dataset.nome;
    const preco = categorias[nome];
    total += qtd * preco;
  });

  document.getElementById("total-venda").innerText = `Total: R$ ${total.toFixed(2)}`;
}

function registrarVenda() {
  const cliente = document.getElementById("cliente-nome").value.trim();
  const valorPago = parseFloat(document.getElementById("valor-pago").value) || 0;
  const inputs = document.querySelectorAll("#form-venda input");

  let itens = {};
  let total = 0;

  inputs.forEach(input => {
    const qtd = parseInt(input.value) || 0;
    if (qtd > 0) {
      const nome = input.dataset.nome;
      const preco = categorias[nome];
      itens[nome] = qtd;
      total += qtd * preco;
    }
    input.value = 0; // resetar input
  });

  if (total === 0) {
    alert("Nenhuma peça selecionada.");
    return;
  }

  vendas.push({ cliente, itens, total, pago: valorPago });
  salvar();
  atualizarVendas();
  calcularTotalVenda();

  document.getElementById("cliente-nome").value = "";
  document.getElementById("valor-pago").value = "";
}

function atualizarVendas() {
  const lista = document.getElementById("lista-vendas");
  const totalArrecadado = document.getElementById("total-arrecadado");
  const totalReceber = document.getElementById("total-receber");

  lista.innerHTML = "";
  let arrecadado = 0;
  let receber = 0;

  vendas.forEach(venda => {
    arrecadado += venda.pago;
    receber += venda.total - venda.pago;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${venda.cliente || "Cliente sem nome"}</strong> - 
      Total: R$${venda.total.toFixed(2)} / Pago: R$${venda.pago.toFixed(2)}
    `;
    lista.appendChild(li);
  });

  totalArrecadado.innerText = arrecadado.toFixed(2);
  totalReceber.innerText = receber.toFixed(2);
}

// Inicialização
atualizarCategorias();
atualizarVendas();
