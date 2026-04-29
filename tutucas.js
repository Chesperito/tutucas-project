let carrinho = [];
let total = 0;


// ABRIR SABORES

function abrirSabores(botao, nome, preco) {
  let item = botao.parentElement;
  let box = item.querySelector(".sabores");

  let aberto = window.getComputedStyle(box).display === "block";

  // fecha todos
  document.querySelectorAll(".sabores").forEach(s => s.style.display = "none");

  if (!aberto) {
    box.style.display = "block";
  }

  botao.dataset.nome = nome;
  botao.dataset.preco = preco;
}


// ABRIR MARMITEX

function abrirMarmitex(botao, nome, preco) {
  let box = botao.nextElementSibling;

  let aberto = window.getComputedStyle(box).display === "block";

 
  document.querySelectorAll(".marmitex-box").forEach(b => b.style.display = "none");

  if (!aberto) {
    box.style.display = "block";
  }

  botao.dataset.nome = nome;
  botao.dataset.preco = preco;
}


// CONFIRMAR MARMITEX

function confirmarMarmitex(botao) {
  let box = botao.parentElement;
  let item = box.parentElement;
  
  let obrigatorios = ["Feijao", "Carne", "Especial", "Salada", "Verdura"];

  for (let nomeItemNaoMarcado of obrigatorios) {
    let marcado = box.querySelector(`input[name^="${nomeItemNaoMarcado}"]:checked`);
    
    if (!marcado) {
      alert(`Escolha uma opção de ${nomeItemNaoMarcado.toLowerCase()}`);
      return;
    }
  }

  let btn = box.previousElementSibling;

  function pegar(prefixo, padrao) {
    let el = box.querySelector(`input[name^="${prefixo}"]:checked`);
    return el ? el.value : padrao;
  }

  let feijao = pegar("Feijao", "Sem feijão");
  let carne = pegar("Carne", "Sem carne");
  let especial = pegar("Especial", "Sem especial");
  let salada = pegar("Salada", "Sem salada");
  let verdura = pegar("Verdura", "Sem verdura");

  let descricao = `Feijão: ${feijao}, Carne: ${carne}, Especial: ${especial}, Salada: ${salada}, Verdura: ${verdura}`;

  let nome = btn.dataset.nome;
  let preco = Number(btn.dataset.preco);

  addItem(`${nome} (${descricao})`, preco);

  // resetar radios
  box.querySelectorAll("input[type='radio']").forEach(i => i.checked = false);

  box.style.display = "none";
}

// CONFIRMAR ITEM (PIZZA / SUCO)

function confirmarItem(botao) {
  let box = botao.parentElement;
  if (!box) return;

  let item = box.parentElement;
  if (!item) return;

  let btn = item.querySelector("button:not(.confirmar)");
  if (!btn) return;

  let selecionados = box.querySelectorAll("input:checked");

  if (selecionados.length === 0) {
    alert("Escolha pelo menos 1 opção");
    return;
  }

  if (selecionados.length > 4) {
    alert("Escolha no máximo 4 opções");
    return;
  }

  let sabores = [];
  selecionados.forEach(s => sabores.push(s.value));

  let metadeBox = box.querySelector(".metade-box");
  let select = box.querySelector(".metade-select");

  if (sabores.length === 3) {
    if (!metadeBox || !select) {
      alert("Erro no sistema: configuração de metade não encontrada");
      return;
    }

    if (metadeBox.style.display !== "block") {
      metadeBox.style.display = "block";

      select.innerHTML = "";

      sabores.forEach(sabor => {
        let option = document.createElement("option");
        option.value = sabor;
        option.textContent = sabor;
        select.appendChild(option);
      });

      return;
    }
  }

  let nome = btn.dataset.nome;
  let preco = Number(btn.dataset.preco);

  if (sabores.length === 3) {
    let metade = select.value;

    if (!metade) {
      alert("Escolha o sabor que será metade");
      return;
    }

    addItem(`${nome} (1/2 ${metade} + 1/4 ${sabores.filter(s => s !== metade).join(" + 1/4 ")})`, preco);
  } else {
    addItem(`${nome} (${sabores.join(", ")})`, preco);
  }

  // RESET
  box.querySelectorAll("input").forEach(i => {
    i.checked = false;
    i.disabled = false;
  });

  if (metadeBox) metadeBox.style.display = "none";
  box.style.display = "none";
}

// ADICIONAR ITEM
function addItem(nome, preco) {
  carrinho.push({ nome, preco });
  total += preco;
  atualizar();
  mostrarCarrinho();
}
// MOSTRAR CARRINHO
function mostrarCarrinho() {
  const carrinho = document.querySelector(".carrinho");

  carrinho.style.display = "block";

  // reinicia animação
  carrinho.style.animation = "none";
  carrinho.offsetHeight;
  carrinho.style.animation = "subir 0.3s ease";
}

// ATUALIZAR CARRINHO
function atualizar() {
  let lista = document.getElementById("lista");
  lista.innerHTML = "";

  carrinho.forEach(item => {
    let li = document.createElement("li");
    li.innerText = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
    lista.appendChild(li);
  });

  document.getElementById("total").innerText = total.toFixed(2);
  const carrinhoBox = document.querySelector(".carrinho");

  if (carrinho.length === 0) {
    carrinhoBox.style.display = "none"; 
  }
}

// PAGAMENTO
function verificarPagamento() {
  const pagamento = document.querySelector('input[name="pagamento"]:checked')?.value;
  const trocoBox = document.getElementById('trocoBox');

  trocoBox.style.display = pagamento === "Dinheiro" ? "block" : "none";
}
// DATA E HORA DE FUNCIONAMENTO
function restauranteAberto() {
  const agora = new Date();

  const dataBR = new Date(
    agora.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );

  const dia = dataBR.getDay();
  const hora = dataBR.getHours();
  const minuto = dataBR.getMinutes();

  const horarioAtual = hora + (minuto / 60);

  // DOMINGO
  if (dia === 0) {
    return horarioAtual >= 18 && horarioAtual <= 22;
  }

  // OUTROS DIAS
  const almoco = horarioAtual >= 10.5 && horarioAtual <= 13.5;
  const noite = horarioAtual >= 18 && horarioAtual <= 22;

  return almoco || noite;
}
//  ATUALIZAR STATUS DE SE ESTA ABERTO OU FECHADO
function atualizarStatus() {
  const status = document.getElementById("status");
  const agora = new Date();
  const dia = agora.getDay(); 
  const hora = agora.getHours();
  const minutos = agora.getMinutes();
  const horaAtual = hora + minutos / 60;

  if (restauranteAberto()) 
  {
    status.innerText = "🟢 Aberto";
  } 
  else 
    {
    if (dia === 0)
      {
      if (horaAtual < 18) 
      {
        status.innerText = "🔴 Fechado - abre às 18h (domingo)";
      } else 
        {
        status.innerText = "🟢 Aberto";
      }
    } 
    else 
      {
      if (horaAtual < 10.5) 
      {
        status.innerText = "🔴 Fechado - abre às 10:30";
      } 
      else if (horaAtual >= 13.5 && horaAtual < 18) 
      {
        status.innerText = "🔴 Fechado - reabre às 18h";
      } 
      else if (horaAtual >= 22) 
      {
        status.innerText = "🔴 Fechado - abre amanhã às 10:30";
      } else {
        status.innerText = "🟢 Aberto";
      }
    }
  }
}
//  INFO GERAIS
function carregarInfo() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3hlKTf4goN5NuZ3iG1RTCt0Pilq-fy8crZtgkyaAqR27vofOWfzvaZCJTH8SOt9Zxb4Fm058P9EHN/pub?output=csv";

  fetch(url)
    .then(res => res.text())
    .then(texto => {
      const linhas = texto.trim().split("\n");

      const box = document.getElementById("info-geral");

      box.innerHTML = "";

      linhas.forEach(linha => {
        linha = linha.trim();

        if (linha) {
          const p = document.createElement("p");
          p.textContent = linha;
          box.appendChild(p);
        }
      });
    });
}
// FINALIZAR PEDIDO
function finalizar() 
{  
    if (!restauranteAberto()) {
    alert("Estamos fechados.\n\nFuncionamento:\nSeg a Sáb: 10:30–13:30 e 18:00–22:00\nDomingo: 18:00–22:00");
    return;
  }
   if (carrinho.length === 0) {
  alert("Adicione itens ao pedido");
  return;
}
  
  let nome = document.getElementById("nome").value;
  let endereco = document.getElementById("endereco").value;
  let pagamento = document.querySelector('input[name="pagamento"]:checked')?.value;
  let troco = document.getElementById("troco")?.value;
  let observacoes = document.getElementById("OBS").value;

  if (!nome || !endereco) {
    alert("Preencha seus dados");
    return;
  }

  if (!pagamento) {
    alert("Escolha a forma de pagamento");
    return;
  }

  let mensagem = `Pedido Tutucas 🍕\n\nCliente: ${nome}\nEndereço: ${endereco}\nPagamento: ${pagamento}\nObservações: ${observacoes}\n`;

  if (pagamento === "Dinheiro" && troco) 
{
  mensagem += `Troco para: R$ ${troco}\n`;
}

// verifica se tem pizza ou porção nas entregas de almoço e marmitex na entrega de noite
let temItemRestritoManha = carrinho.some(item => {
  let nomeItem1 = item.nome.toLowerCase();
  return nomeItem1.includes("pizza") || 
         nomeItem1.includes("fritas") || 
         nomeItem1.includes("macaxeira") || 
         nomeItem1.includes("chapa");
});
let temItemRestritoNoite = carrinho.some(item => {
  let nomeItem2 = item.nome.toLowerCase();
  return nomeItem2.includes("marmitex");
});

 const dataBR = new Date(
  new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
);
 const dia = dataBR.getDay(); 
 const hora = dataBR.getHours();
 const minutos = dataBR.getMinutes();
 const horaAtual = hora + minutos / 60;

if (temItemRestritoManha && (horaAtual < 18 || horaAtual > 22)) {
  alert("A entrega de Pizzas e Porções só é possível entre 18:00–22:00");
  return;
} 

if (temItemRestritoNoite && (horaAtual < 10.5 || horaAtual > 13.5)) {
  alert("A entrega de Marmitex só é possível entre 10:30–13:30");
  return;
}

 
mensagem += `\n`;

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (R$ ${item.preco.toFixed(2)})\n`;
  });

  mensagem += `\n`;


  mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

  let telefone = "5533991031423";
  let link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
  
  let pedidoTexto = carrinho.map(item => 
  `${item.nome} (R$ ${item.preco.toFixed(2)})`
).join(", ");

fetch("https://script.google.com/macros/s/AKfycbz6IvMD5jLo0c4DaEpl3has1Zgy3iIRXwd8fMCEv8UZ48Ac4puBgdLUHB1tsw-WdZwaMQ/exec", {
  method: "POST",
  mode: "no-cors",
  body: JSON.stringify({
    nome: nome,
    pagamento: pagamento,
    endereco: endereco,
    pedido: pedidoTexto,
    observacoes: observacoes,
    total: total.toFixed(2)
  })
});
  window.open(link, "_blank");
  setTimeout(() => {
  carrinho = [];
  total = 0;
  atualizar();
}, 1000);
}
// LIMITAR SABORES 
function limitarSabores() {
  document.querySelectorAll('.sabores').forEach(box => {
    const inputs = box.querySelectorAll('input[type="checkbox"]');

    inputs.forEach(input => {
      input.addEventListener('change', () => {
        const selecionados = box.querySelectorAll('input:checked');

        if (selecionados.length >= 4) {
          inputs.forEach(i => {
            if (!i.checked) i.disabled = true;
          });
        } else {
          inputs.forEach(i => i.disabled = false);
        }
      });
    });
  });
}

window.onload = function() {
  limitarSabores();
  atualizarStatus();
  carregarInfo(); 
  setInterval(atualizarStatus, 60000);
  function carregarCardapio() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQurYk5MovMx8djBr0QS8XMFRcZQQpdNvQFt8Db2zXV2aWZ4AshRkmn5QCFyxBf5ksX22qCWAcaa4vI/pub?output=csv";

  fetch(url)
    .then(res => res.text())
    .then(texto => {

      texto = texto.replace(/\r/g, "");

      const linhas = texto.trim().split("\n");
      if (linhas.length < 2) return;

      const box = document.getElementById("cardapio");
      box.innerHTML = "";

     
      const separador = linhas[0].includes(";") ? ";" : ",";

      const primeiraLinha = linhas[1].split(separador);
      const data = primeiraLinha[0];

      const titulo = document.createElement("h2");
      titulo.textContent = `Cardápio do dia: ${data}`;
      titulo.classList.add("titulo-cardapio");

      box.appendChild(titulo);


      const tabela = document.createElement("table");

  
      const cabecalho = linhas[0].split(separador);
      cabecalho.shift(); // remove coluna da data

      const trHead = document.createElement("tr");

      cabecalho.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col.trim();
        trHead.appendChild(th);
      });

      tabela.appendChild(trHead);

  
      for (let i = 1; i < linhas.length; i++) {
        if (!linhas[i]) continue;

        const valores = linhas[i].split(separador);

        valores.shift(); // remove data

        const tr = document.createElement("tr");

        valores.forEach(valor => {
          const td = document.createElement("td");
          td.textContent = valor.trim();
          tr.appendChild(td);
        });

        tabela.appendChild(tr);
      }

      box.appendChild(tabela);
    })
    .catch(err => {
      console.error("Erro:", err);
    });
}
};