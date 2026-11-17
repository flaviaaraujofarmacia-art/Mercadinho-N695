const btnProdutos = document.getElementById("btnProdutos");
const conteudo = document.getElementById("conteudo");

btnProdutos.addEventListener("click", async () => {
  conteudo.innerHTML = "<h2>Produtos</h2><p>Carregando...</p>";

  try {
    const resposta = await fetch("/produtos");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    const produtos = await resposta.json();

   
conteudo.innerHTML = "<h2>Lista de Produtos</h2>";

const tabela = document.createElement("table");

tabela.innerHTML = `
  <thead>
    <tr>
      <th>Código</th>
      <th>Produto</th>
      <th>Fabricante</th>
      <th>Preço</th>
      <th>Estoque</th>
      <th>Ações</th>

    </tr>
  </thead>
  <tbody></tbody>
`;

const corpo = tabela.querySelector("tbody");

produtos.forEach((produto) => {
  const linha = document.createElement("tr");

  const valores = [
    produto.codigo,
    produto.nome,
    produto.fabricante,
    Number(produto.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    }),
    produto.quantidade_estoque
  ];

  valores.forEach((valor) => {
    const celula = document.createElement("td");
    celula.textContent = valor ?? "";
    linha.appendChild(celula);
  });

  const celulaAcoes = document.createElement("td");
const botaoEditar = document.createElement("button");

botaoEditar.textContent = "Editar";
botaoEditar.type = "button";

botaoEditar.addEventListener("click", () => {
  editarProduto(produto);
});



const botaoExcluir = document.createElement("button");
botaoExcluir.textContent = "Excluir";
botaoExcluir.type = "button";

botaoExcluir.addEventListener("click", async () => {
  const confirmar = confirm(
    `Deseja realmente excluir o produto "${produto.nome}"?`
  );

  if (!confirmar) {
    return;
  }
  try {
    const resposta = await fetch(`/produtos/${produto.codigo}`, {
        method: "DELETE"
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao excluir produto.");
    }

    alert("Produto excluído com sucesso!");
    btnProdutos.click();

} catch (erro) {
    alert("Erro ao excluir produto: " + erro.message);
}
});

celulaAcoes.appendChild(botaoEditar);
celulaAcoes.appendChild(botaoExcluir);
linha.appendChild(celulaAcoes);
  corpo.appendChild(linha);
});

conteudo.appendChild(tabela);

   
  } catch (erro) {
    conteudo.textContent = "Não foi possível carregar os produtos.";
  }
});

const btnFornecedores = document.getElementById("btnFornecedores");

btnFornecedores.addEventListener("click", async () => {
  conteudo.innerHTML = "<h2>Fornecedores</h2><p>Carregando...</p>";

  try {
    const resposta = await fetch("/fornecedores");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar fornecedores");
    }

    const fornecedores = await resposta.json();

    
conteudo.innerHTML = "<h2>Lista de Fornecedores</h2>";

const tabela = document.createElement("table");

tabela.innerHTML = `
  <thead>
    <tr>
      <th>Código</th>
      <th>Razão Social</th>
      <th>CNPJ</th>
      <th>Telefone</th>
      <th>E-mail</th>
      
<th>Ações</th>
    
 
    </tr>
  </thead>
  <tbody></tbody>
`;

const corpo = tabela.querySelector("tbody");

fornecedores.forEach((fornecedor) => {
  const linha = document.createElement("tr");

  const valores = [
    fornecedor.id_fornecedor,
    fornecedor.razao_social,
    fornecedor.cnpj,
    fornecedor.telefone,
    fornecedor.email
  ];

  valores.forEach((valor) => {
    const celula = document.createElement("td");
    celula.textContent = valor ?? "";
    linha.appendChild(celula);
  });

  
  const celulaAcoes = document.createElement("td");

const botaoProdutos = criarBotao("Produtos", () => {
  mostrarProdutosDoFornecedor(fornecedor.id_fornecedor);
});

const botaoEditar = criarBotao("Editar", () => {
  editarFornecedor(fornecedor);
});

celulaAcoes.appendChild(botaoProdutos);
celulaAcoes.appendChild(botaoEditar);

// Aqui vamos inserir o botão Excluir


linha.appendChild(celulaAcoes);

const botaoExcluirFornecedor = document.createElement("button");
botaoExcluirFornecedor.textContent = "Excluir";
botaoExcluirFornecedor.type = "button";

botaoExcluirFornecedor.addEventListener("click", async () => {
  const confirmar = confirm(
    `Deseja realmente excluir o fornecedor "${fornecedor.razao_social}"?`
  );

  if (!confirmar) return;

  try {
    const resposta = await fetch(
      `/fornecedores/${fornecedor.id_fornecedor}`,
      { method: "DELETE" }
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert(resultado.mensagem || "Erro ao excluir fornecedor.");
      return;
    }

    alert(resultado.mensagem || "Fornecedor excluído com sucesso.");
    btnFornecedores.click();
  } catch (erro) {
    alert("Erro ao excluir fornecedor: " + erro.message);
  }
});

celulaAcoes.appendChild(botaoExcluirFornecedor);
linha.appendChild(celulaAcoes);
corpo.appendChild(linha);

 
});

conteudo.appendChild(tabela);

  } catch (erro) {
    conteudo.textContent = "Não foi possível carregar os fornecedores.";
  }
});


function mostrarFormularioFornecedor() {
  conteudo.innerHTML = `
    <h2>Cadastrar fornecedor</h2>

    <form id="formFornecedor">
      <label for="razao_social">Razão social:</label>
      <input type="text" id="razao_social" required>

      <label for="cnpj">CNPJ:</label>
      <input type="text" id="cnpj" required>

      <label for="telefone">Telefone:</label>
      <input type="text" id="telefone">

      <label for="email">E-mail:</label>
      <input type="email" id="email">

      <button type="submit">Cadastrar fornecedor</button>
    </form>
  `;
}

const btnCadastrarFornecedor = document.getElementById("btnCadastrarFornecedor");

btnCadastrarFornecedor.addEventListener("click", () => {
  mostrarFormularioFornecedor();
});

document.addEventListener("submit", async (evento) => {
  if (evento.target.id !== "formFornecedor") return;

  evento.preventDefault();

  const razao_social = document.getElementById("razao_social").value;
  const cnpj = document.getElementById("cnpj").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;


  try {
    const resposta = await fetch("/fornecedores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        razao_social,
        cnpj,
        telefone,
        email
      })
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Erro no cadastro.");
    }

    alert("Fornecedor cadastrado com sucesso!");
    evento.target.reset();

  } catch (erro) {
    alert("Erro ao cadastrar fornecedor: " + erro.message);
  }
});

const btnCadastrarProduto = document.getElementById("btnCadastrarProduto");


btnCadastrarProduto.addEventListener("click", () => {
  conteudo.innerHTML = `
    <h2>Cadastro de Produtos</h2>

    <form id="formProduto">
      <label for="nomeProduto">Nome do produto:</label>
      <input type="text" id="nomeProduto" required>

      <label for="fabricanteProduto">Fabricante:</label>
      <input type="text" id="fabricanteProduto" required>

      <label for="precoProduto">Preço (R$):</label>
      <input type="number" id="precoProduto" step="0.01" min="0" required>

      <label for="estoqueProduto">Quantidade em estoque:</label>
      <input type="number" id="estoqueProduto" min="0" step="1" required>

      <label for="fornecedorProduto">Código do fornecedor:</label>
      <input type="number" id="fornecedorProduto" min="1" step="1" required>

      <button type="submit">Cadastrar produto</button>
    </form>
  `;
});

document.addEventListener("submit", async (evento) => {
  if (evento.target.id !== "formProduto") return;

  evento.preventDefault();

  const produto = {
    nome: document.getElementById("nomeProduto").value.trim(),
    fabricante: document.getElementById("fabricanteProduto").value.trim(),
    preco: Number(document.getElementById("precoProduto").value),
    quantidade_estoque: Number(document.getElementById("estoqueProduto").value),
    id_fornecedor: Number(document.getElementById("fornecedorProduto").value)
  };

  try {
    const resposta = await fetch("/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(produto)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Erro ao cadastrar produto.");
    }

    alert("Produto cadastrado com sucesso!");
    evento.target.reset();

  } catch (erro) {
    alert("Erro ao cadastrar produto: " + erro.message);
  }
});

function editarProduto(produto, aoSalvar = () => btnProdutos.click()) {
  conteudo.innerHTML = `
    <h2>Editar Produto</h2>

    <form id="formEditarProduto">
      <label>Nome do produto:</label>
      <input type="text" id="editarNome"
        value="${produto.nome}" required>

      <label>Fabricante:</label>
      <input type="text" id="editarFabricante"
        value="${produto.fabricante}" required>

      <label>Preço (R$):</label>
      <input type="number" id="editarPreco"
        value="${produto.preco}" step="0.01" min="0" required>

      <label>Quantidade em estoque:</label>
      <input type="number" id="editarEstoque"
       value="${produto.quantidade_estoque}" min="0" step="1" required>

      <label>Código do fornecedor:</label>
      <input type="number" id="editarFornecedor"
        value="${produto.id_fornecedor}" min="1" step="1" required>

      <button type="submit">Salvar alterações</button>
    </form>
  `;     
  

  // Aqui vamos adicionar o salvamento

  const formEditar = document.getElementById("formEditarProduto");

  formEditar.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dadosAtualizados = {
      nome: document.getElementById("editarNome").value,
      fabricante: document.getElementById("editarFabricante").value,
      preco: Number(document.getElementById("editarPreco").value),
      quantidade_estoque: Number(document.getElementById("editarEstoque").value),
      id_fornecedor: Number(document.getElementById("editarFornecedor").value)
    };

    try {
      const resposta = await fetch(`/produtos/${produto.codigo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosAtualizados)
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao atualizar produto.");
      }

      alert("Produto atualizado com sucesso!");
      aoSalvar();

    } catch (erro) {
      alert("Erro ao atualizar produto: " + erro.message);
    }
  });
}


function editarFornecedor(fornecedor) {

conteudo.innerHTML = `
  <h2>Editar Fornecedor</h2>

<label>Razão Social:</label>
<input type="text" id="editarRazaoSocial" value="${fornecedor.razao_social}" required>

<label>CNPJ:</label>
<input type="text" id="editarCnpj" value="${fornecedor.cnpj}" maxlength="14" minlength="14" pattern="[0-9]{14}" required>

<label>Telefone:</label>
<input type="text" id="editarTelefone" value="${fornecedor.telefone || ''}">

<label>E-mail:</label>
<input type="email" id="editarEmail" value="${fornecedor.email || ''}">

<button type="button" id="btnSalvarFornecedor">
  Salvar alterações
</button>

`;

const btnSalvarFornecedor = document.getElementById("btnSalvarFornecedor");

btnSalvarFornecedor.addEventListener("click", async () => {
const razao_social = document.getElementById("editarRazaoSocial").value.trim();
const cnpj = document.getElementById("editarCnpj").value.trim();

const telefone = document.getElementById("editarTelefone").value.trim();

const email = document.getElementById("editarEmail").value.trim();

const dadosAtualizados = {
  razao_social,
  cnpj,
  telefone,
  email
};

const resposta = await fetch(`/fornecedores/${fornecedor.id_fornecedor}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(dadosAtualizados)
});

const resultado = await resposta.json();

if (!resposta.ok) {
  alert(resultado.mensagem || "Erro ao atualizar fornecedor.");
  return;
}

alert("Fornecedor atualizado com sucesso!");

btnFornecedores.click();



});

}


// ---------- Tela: produtos de um fornecedor ----------

function criarBotao(texto, aoClicar) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = texto;
  botao.addEventListener("click", aoClicar);
  return botao;
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

async function mostrarProdutosDoFornecedor(idFornecedor) {
  conteudo.innerHTML = "<h2>Produtos do fornecedor</h2><p>Carregando...</p>";

  try {
    const resposta = await fetch(`/fornecedores/${idFornecedor}/produtos`);
    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Erro ao buscar produtos do fornecedor.");
    }

    desenharProdutosDoFornecedor(resultado.fornecedor, resultado.produtos);
  } catch (erro) {
    conteudo.textContent = "Não foi possível carregar os produtos: " + erro.message;
  }
}

function desenharProdutosDoFornecedor(fornecedor, produtos) {
  const voltarParaEstaTela = () => mostrarProdutosDoFornecedor(fornecedor.id_fornecedor);

  conteudo.innerHTML = "";

  const titulo = document.createElement("h2");
  titulo.textContent = `Produtos de ${fornecedor.razao_social}`;

  const detalhe = document.createElement("p");
  detalhe.textContent = `CNPJ ${fornecedor.cnpj} — ${produtos.length} produto(s) cadastrado(s)`;

  const barraAcoes = document.createElement("p");
  barraAcoes.style.display = "flex";
  barraAcoes.style.gap = "12px";
  barraAcoes.appendChild(criarBotao("Cadastrar produto para este fornecedor", () => {
    mostrarFormularioProdutoDoFornecedor(fornecedor);
  }));
  barraAcoes.appendChild(criarBotao("Voltar para fornecedores", () => btnFornecedores.click()));

  conteudo.append(titulo, detalhe, barraAcoes);

  if (produtos.length === 0) {
    const aviso = document.createElement("p");
    aviso.textContent = "Este fornecedor ainda não tem produtos cadastrados.";
    conteudo.appendChild(aviso);
    return;
  }

  const tabela = document.createElement("table");
  tabela.innerHTML = `
    <thead>
      <tr>
        <th>Código</th><th>Produto</th><th>Fabricante</th>
        <th>Preço</th><th>Estoque</th><th>Ações</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const corpo = tabela.querySelector("tbody");

  produtos.forEach((produto) => {
    const linha = document.createElement("tr");
    const valores = [
      produto.codigo, produto.nome, produto.fabricante,
      formatarPreco(produto.preco), produto.quantidade_estoque
    ];

    valores.forEach((valor) => {
      const celula = document.createElement("td");
      celula.textContent = valor ?? "";
      linha.appendChild(celula);
    });

    const celulaAcoes = document.createElement("td");
    celulaAcoes.appendChild(criarBotao("Editar", () => editarProduto(produto, voltarParaEstaTela)));
    linha.appendChild(celulaAcoes);
    corpo.appendChild(linha);
  });

  conteudo.appendChild(tabela);
}

function mostrarFormularioProdutoDoFornecedor(fornecedor) {
  conteudo.innerHTML = `
    <h2>Cadastrar produto</h2>
    <p id="nomeFornecedorDoProduto"></p>

    <form id="formProdutoDoFornecedor">
      <label for="nomeNovoProduto">Nome do produto:</label>
      <input type="text" id="nomeNovoProduto" required>

      <label for="fabricanteNovoProduto">Fabricante:</label>
      <input type="text" id="fabricanteNovoProduto" required>

      <label for="precoNovoProduto">Preço (R$):</label>
      <input type="number" id="precoNovoProduto" step="0.01" min="0" required>

      <label for="estoqueNovoProduto">Quantidade em estoque:</label>
      <input type="number" id="estoqueNovoProduto" min="0" step="1" required>

      <button type="submit">Cadastrar produto</button>
    </form>
  `;

  document.getElementById("nomeFornecedorDoProduto").textContent =
    `Fornecedor: ${fornecedor.razao_social}`;

  const voltar = criarBotao("Voltar", () => mostrarProdutosDoFornecedor(fornecedor.id_fornecedor));
  conteudo.appendChild(voltar);

  document.getElementById("formProdutoDoFornecedor").addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const produto = {
      nome: document.getElementById("nomeNovoProduto").value.trim(),
      fabricante: document.getElementById("fabricanteNovoProduto").value.trim(),
      preco: Number(document.getElementById("precoNovoProduto").value),
      quantidade_estoque: Number(document.getElementById("estoqueNovoProduto").value),
      id_fornecedor: fornecedor.id_fornecedor
    };

    try {
      const resposta = await fetch("/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
      });
      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao cadastrar produto.");
      }

      alert("Produto cadastrado com sucesso!");
      mostrarProdutosDoFornecedor(fornecedor.id_fornecedor);
    } catch (erro) {
      alert("Erro ao cadastrar produto: " + erro.message);
    }
  });
}
