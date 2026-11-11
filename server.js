
const express = require("express");
const db = require("./db");

const app = express();
const PORTA = 3000;

app.use(express.json());

function validarCNPJ(cnpj) {
  return typeof cnpj === "string" && /^\d{14}$/.test(cnpj);
}

app.get("/", (req, res) => {
  res.json({
    mensagem: "API do Mercadinho funcionando!"
  });
});


app.get("/fornecedores", async (req, res) => {
  try {
    const [fornecedores] = await db.query(
      "SELECT * FROM fornecedor"
    );

    res.json(fornecedores);
  } catch (erro) {
    console.error("Erro ao buscar fornecedores:", erro);
    res.status(500).json({
      mensagem: "Erro ao consultar fornecedores."
    });
  }
});


app.put("/fornecedores/:id", async (req, res) => {
  try {

const id = Number(req.params.id);

if (!Number.isInteger(id) || id <= 0) {
  return res.status(400).json({
    mensagem: "ID do fornecedor inválido."
  });
}

const { razao_social, cnpj, telefone, email } = req.body;

if (
  typeof razao_social !== "string" ||
  !razao_social.trim() ||
  typeof cnpj !== "string" ||
  !/^\d{14}$/.test(cnpj)
) {
  return res.status(400).json({
    mensagem: "Razão social e CNPJ válido com 14 dígitos são obrigatórios."
  });
}

const [resultado] = await db.query(
  `UPDATE fornecedor
   SET razao_social = ?, cnpj = ?, telefone = ?, email = ?
   WHERE id_fornecedor = ?`,
  [razao_social.trim(), cnpj, telefone, email, id]
);

if (resultado.affectedRows === 0) {
  return res.status(404).json({
    mensagem: "Fornecedor não encontrado."
  });
}

return res.status(200).json({
  mensagem: "Fornecedor atualizado com sucesso!",
  id_fornecedor: id
});

  } catch (erro) {
    console.error("Erro ao atualizar fornecedor:", erro);
    res.status(500).json({
      mensagem: "Erro ao atualizar fornecedor."
    });
  }
});



app.delete("/fornecedores/:id", async (req, res) => {
  try {

const id = Number(req.params.id);

if (!Number.isInteger(id) || id <= 0) {
  return res.status(400).json({
    mensagem: "ID do fornecedor inválido."
  });
}

const [produtos] = await db.query(
  "SELECT COUNT(*) AS total FROM produto WHERE id_fornecedor = ?",
  [id]
);

if (produtos[0].total > 0) {
  return res.status(409).json({
    mensagem: "Não é possível excluir fornecedor com produtos associados."
  });
}

const [resultado] = await db.query(
  "DELETE FROM fornecedor WHERE id_fornecedor = ?",
  [id]
);

if (resultado.affectedRows === 0) {
  return res.status(404).json({
    mensagem: "Fornecedor não encontrado."
  });
}

return res.status(200).json({
  mensagem: "Fornecedor excluído com sucesso!",
  id_fornecedor: id
});

  } catch (erro) {
    console.error("Erro ao excluir fornecedor:", erro);
    res.status(500).json({
      mensagem: "Erro ao excluir fornecedor."
    });
  }
});



app.get("/produtos", async (req, res) => {
  try {
    const [produtos] = await db.query(
      "SELECT * FROM produto"
    );

    res.json(produtos);
  } catch (erro) {
    console.error("Erro ao buscar produtos:", erro);
    res.status(500).json({
      mensagem: "Erro ao consultar produtos."
    });
  }
});


app.post("/produtos", async (req, res) => {
  try {

const { nome, fabricante, preco, quantidade_estoque, id_fornecedor } = req.body;

if (
  typeof nome !== "string" ||
  !nome.trim() ||
  typeof fabricante !== "string" ||
  !fabricante.trim() ||
  preco === undefined ||
  preco === null ||
  preco === "" ||
  quantidade_estoque === undefined ||
  quantidade_estoque === null ||
  quantidade_estoque === "" ||
  id_fornecedor === undefined ||
  id_fornecedor === null ||
  id_fornecedor === ""
) {
  return res.status(400).json({
    mensagem: "Todos os campos do produto são obrigatórios."
  });
}

const precoNumero = Number(preco);
const estoqueNumero = Number(quantidade_estoque);

if (
  !Number.isFinite(precoNumero) ||
  precoNumero < 0 ||
  !Number.isInteger(estoqueNumero) ||
  estoqueNumero < 0
) {
  return res.status(400).json({
    mensagem: "Preço e estoque devem ser números válidos e não negativos."
  });
}

const fornecedorId = Number(id_fornecedor);

if (
  !Number.isInteger(fornecedorId) ||
  fornecedorId <= 0
) {
  return res.status(400).json({
    mensagem: "ID do fornecedor inválido."
  });
}
    const sql = `
      INSERT INTO produto
      (nome, fabricante, preco, quantidade_estoque, id_fornecedor)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [resultado] = await db.query(sql, [
      nome.trim(),
      fabricante.trim(),
      precoNumero,
      estoqueNumero,
      fornecedorId
    ]);

    return res.status(201).json({
      mensagem: "Produto cadastrado com sucesso!",
      codigo: resultado.insertId
    });

  } catch (erro) {
    console.error("Erro ao cadastrar produto:", erro);
    return res.status(500).json({
      mensagem: "Erro ao cadastrar produto."
    });
  }
});

app.put("/produtos/:codigo", async (req, res) => {

try {
const codigo = Number(req.params.codigo);

if (!Number.isInteger(codigo) || codigo <= 0) {
  return res.status(400).json({
    mensagem: "Código do produto inválido."
  });
}

const {
  nome,
  fabricante,
  preco,
  quantidade_estoque,
  id_fornecedor
} = req.body;

if (
  typeof nome !== "string" ||
  !nome.trim() ||
  typeof fabricante !== "string" ||
  !fabricante.trim() ||
  preco === undefined ||
  preco === null ||
  preco === "" ||
  quantidade_estoque === undefined ||
  quantidade_estoque === null ||
  quantidade_estoque === "" ||
  id_fornecedor === undefined ||
  id_fornecedor === null ||
  id_fornecedor === ""
) {
  return res.status(400).json({
    mensagem: "Todos os campos do produto são obrigatórios."
  });
}

const precoNumero = Number(preco);
const estoqueNumero = Number(quantidade_estoque);

if (
  !Number.isFinite(precoNumero) ||
  precoNumero < 0 ||
  !Number.isInteger(estoqueNumero) ||
  estoqueNumero < 0
) {
  return res.status(400).json({
    mensagem: "Preço e estoque devem ser números válidos e não negativos."
  });
}

const fornecedorId = Number(id_fornecedor);

if (
  !Number.isInteger(fornecedorId) ||
  fornecedorId <= 0
) {
  return res.status(400).json({
    mensagem: "ID do fornecedor inválido."
  });
}

const sql = `
  UPDATE produto
  SET nome = ?,
      fabricante = ?,
      preco = ?,
      quantidade_estoque = ?,
      id_fornecedor = ?
  WHERE codigo = ?
`;

const [resultado] = await db.query(sql, [
  nome.trim(),
  fabricante.trim(),
  precoNumero,
  estoqueNumero,
  fornecedorId,
  codigo
]);

if (resultado.affectedRows === 0) {
  return res.status(404).json({
    mensagem: "Produto não encontrado."
  });
}

return res.status(200).json({
  mensagem: "Produto atualizado com sucesso!",
  codigo: codigo
}); 
} catch (erro) {

  console.error("Erro ao atualizar produto:", erro);

  return res.status(500).json({
    mensagem: "Erro ao atualizar produto."
  });
}
});

app.delete("/produtos/:codigo", async (req, res) => {

try {

const codigo = Number(req.params.codigo);

if (!Number.isInteger(codigo) || codigo <= 0) {
  return res.status(400).json({
    mensagem: "Código do produto inválido."
  });
}

const sql = "DELETE FROM produto WHERE codigo = ?";

const [resultado] = await db.query(sql, [codigo]);

if (resultado.affectedRows === 0) {
  return res.status(404).json({
    mensagem: "Produto não encontrado."
  });
}

return res.status(200).json({
  mensagem: "Produto excluído com sucesso!",
  codigo: codigo
});

} catch (erro) {
  console.error("Erro ao excluir produto:", erro);

  return res.status(500).json({
    mensagem: "Erro ao excluir produto."
  });
}

});


app.listen(PORTA, () => {
  console.log(`Servidor funcionando na porta ${PORTA}`);
});

