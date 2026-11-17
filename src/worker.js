// Worker do Mercadinho N695 (Cloudflare)
// Faz as mesmas rotas do server.js, usando o banco D1 (env.DB) no lugar do MySQL.
// As telas da pasta "public" são servidas automaticamente pelo Cloudflare.

function json(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

function validarCNPJ(cnpj) {
  return typeof cnpj === "string" && /^\d{14}$/.test(cnpj);
}

function vazio(valor) {
  return valor === undefined || valor === null || valor === "";
}

async function lerCorpo(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

// Confere os campos do produto (mesmas regras do server.js)
function validarProduto(corpo) {
  const { nome, fabricante, preco, quantidade_estoque, id_fornecedor } = corpo;

  if (
    typeof nome !== "string" || !nome.trim() ||
    typeof fabricante !== "string" || !fabricante.trim() ||
    vazio(preco) || vazio(quantidade_estoque) || vazio(id_fornecedor)
  ) {
    return { erro: "Todos os campos do produto são obrigatórios." };
  }

  const precoNumero = Number(preco);
  const estoqueNumero = Number(quantidade_estoque);

  if (
    !Number.isFinite(precoNumero) || precoNumero < 0 ||
    !Number.isInteger(estoqueNumero) || estoqueNumero < 0
  ) {
    return { erro: "Preço e estoque devem ser números válidos e não negativos." };
  }

  const fornecedorId = Number(id_fornecedor);

  if (!Number.isInteger(fornecedorId) || fornecedorId <= 0) {
    return { erro: "ID do fornecedor inválido." };
  }

  return {
    valores: [nome.trim(), fabricante.trim(), precoNumero, estoqueNumero, fornecedorId]
  };
}

async function fornecedorExiste(db, id) {
  const linha = await db
    .prepare("SELECT id_fornecedor FROM fornecedor WHERE id_fornecedor = ?")
    .bind(id)
    .first();
  return Boolean(linha);
}

// ---------- Fornecedores ----------

async function listarFornecedores(env) {
  const { results } = await env.DB.prepare("SELECT * FROM fornecedor").all();
  return json(results);
}

async function cadastrarFornecedor(request, env) {
  const { razao_social, cnpj, telefone, email } = await lerCorpo(request);

  if (typeof razao_social !== "string" || !razao_social.trim() || !validarCNPJ(cnpj)) {
    return json({ mensagem: "Razão social ou CNPJ inválido." }, 400);
  }

  const resultado = await env.DB
    .prepare("INSERT INTO fornecedor (razao_social, cnpj, telefone, email) VALUES (?, ?, ?, ?)")
    .bind(razao_social.trim(), cnpj, telefone ?? null, email ?? null)
    .run();

  return json(
    { mensagem: "Fornecedor cadastrado com sucesso!", id_fornecedor: resultado.meta.last_row_id },
    201
  );
}

async function atualizarFornecedor(request, env, id) {
  if (!Number.isInteger(id) || id <= 0) {
    return json({ mensagem: "ID do fornecedor inválido." }, 400);
  }

  const { razao_social, cnpj, telefone, email } = await lerCorpo(request);

  if (typeof razao_social !== "string" || !razao_social.trim() || !validarCNPJ(cnpj)) {
    return json({ mensagem: "Razão social e CNPJ válido com 14 dígitos são obrigatórios." }, 400);
  }

  const resultado = await env.DB
    .prepare(
      "UPDATE fornecedor SET razao_social = ?, cnpj = ?, telefone = ?, email = ? WHERE id_fornecedor = ?"
    )
    .bind(razao_social.trim(), cnpj, telefone ?? null, email ?? null, id)
    .run();

  if (resultado.meta.changes === 0) {
    return json({ mensagem: "Fornecedor não encontrado." }, 404);
  }

  return json({ mensagem: "Fornecedor atualizado com sucesso!", id_fornecedor: id });
}

async function excluirFornecedor(env, id) {
  if (!Number.isInteger(id) || id <= 0) {
    return json({ mensagem: "ID do fornecedor inválido." }, 400);
  }

  const { total } = await env.DB
    .prepare("SELECT COUNT(*) AS total FROM produto WHERE id_fornecedor = ?")
    .bind(id)
    .first();

  if (total > 0) {
    return json({ mensagem: "Não é possível excluir fornecedor com produtos associados." }, 409);
  }

  const resultado = await env.DB
    .prepare("DELETE FROM fornecedor WHERE id_fornecedor = ?")
    .bind(id)
    .run();

  if (resultado.meta.changes === 0) {
    return json({ mensagem: "Fornecedor não encontrado." }, 404);
  }

  return json({ mensagem: "Fornecedor excluído com sucesso!", id_fornecedor: id });
}

// ---------- Produtos ----------

async function listarProdutos(env) {
  const { results } = await env.DB.prepare("SELECT * FROM produto").all();
  return json(results);
}

async function cadastrarProduto(request, env) {
  const { erro, valores } = validarProduto(await lerCorpo(request));
  if (erro) return json({ mensagem: erro }, 400);

  if (!(await fornecedorExiste(env.DB, valores[4]))) {
    return json({ mensagem: "Fornecedor não encontrado." }, 400);
  }

  const resultado = await env.DB
    .prepare(
      "INSERT INTO produto (nome, fabricante, preco, quantidade_estoque, id_fornecedor) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(...valores)
    .run();

  return json(
    { mensagem: "Produto cadastrado com sucesso!", codigo: resultado.meta.last_row_id },
    201
  );
}

async function atualizarProduto(request, env, codigo) {
  if (!Number.isInteger(codigo) || codigo <= 0) {
    return json({ mensagem: "Código do produto inválido." }, 400);
  }

  const { erro, valores } = validarProduto(await lerCorpo(request));
  if (erro) return json({ mensagem: erro }, 400);

  if (!(await fornecedorExiste(env.DB, valores[4]))) {
    return json({ mensagem: "Fornecedor não encontrado." }, 400);
  }

  const resultado = await env.DB
    .prepare(
      "UPDATE produto SET nome = ?, fabricante = ?, preco = ?, quantidade_estoque = ?, id_fornecedor = ? WHERE codigo = ?"
    )
    .bind(...valores, codigo)
    .run();

  if (resultado.meta.changes === 0) {
    return json({ mensagem: "Produto não encontrado." }, 404);
  }

  return json({ mensagem: "Produto atualizado com sucesso!", codigo });
}

async function excluirProduto(env, codigo) {
  if (!Number.isInteger(codigo) || codigo <= 0) {
    return json({ mensagem: "Código do produto inválido." }, 400);
  }

  const resultado = await env.DB
    .prepare("DELETE FROM produto WHERE codigo = ?")
    .bind(codigo)
    .run();

  if (resultado.meta.changes === 0) {
    return json({ mensagem: "Produto não encontrado." }, 404);
  }

  return json({ mensagem: "Produto excluído com sucesso!", codigo });
}

// ---------- Rotas ----------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const partes = url.pathname.split("/").filter(Boolean); // ex.: ["produtos", "3"]
    const metodo = request.method;
    const [recurso, idTexto] = partes;
    const id = idTexto === undefined ? undefined : Number(idTexto);

    try {
      if (recurso === "fornecedores" && partes.length <= 2) {
        if (id === undefined && metodo === "GET") return await listarFornecedores(env);
        if (id === undefined && metodo === "POST") return await cadastrarFornecedor(request, env);
        if (id !== undefined && metodo === "PUT") return await atualizarFornecedor(request, env, id);
        if (id !== undefined && metodo === "DELETE") return await excluirFornecedor(env, id);
        return json({ mensagem: "Método não permitido." }, 405);
      }

      if (recurso === "produtos" && partes.length <= 2) {
        if (id === undefined && metodo === "GET") return await listarProdutos(env);
        if (id === undefined && metodo === "POST") return await cadastrarProduto(request, env);
        if (id !== undefined && metodo === "PUT") return await atualizarProduto(request, env, id);
        if (id !== undefined && metodo === "DELETE") return await excluirProduto(env, id);
        return json({ mensagem: "Método não permitido." }, 405);
      }
    } catch (erro) {
      console.error("Erro na rota", metodo, url.pathname, erro);
      return json({ mensagem: "Erro ao acessar o banco de dados." }, 500);
    }

    // Qualquer outro endereço: entrega as telas da pasta public
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Não encontrado", { status: 404 });
  }
};
