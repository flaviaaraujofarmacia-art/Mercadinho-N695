// Acesso aos dados da tabela produto (camada de dados, banco D1)

export async function listarProdutos(db) {
  const { results } = await db.prepare("SELECT * FROM produto ORDER BY codigo").all();
  return results;
}

export async function listarProdutosDoFornecedor(db, idFornecedor) {
  const { results } = await db
    .prepare("SELECT * FROM produto WHERE id_fornecedor = ? ORDER BY codigo")
    .bind(idFornecedor)
    .all();
  return results;
}

export async function contarProdutosDoFornecedor(db, idFornecedor) {
  const linha = await db
    .prepare("SELECT COUNT(*) AS total FROM produto WHERE id_fornecedor = ?")
    .bind(idFornecedor)
    .first();
  return linha.total;
}

export async function inserirProduto(db, p) {
  const resultado = await db
    .prepare("INSERT INTO produto (nome, fabricante, preco, quantidade_estoque, id_fornecedor) VALUES (?, ?, ?, ?, ?)")
    .bind(p.nome, p.fabricante, p.preco, p.quantidade_estoque, p.id_fornecedor)
    .run();
  return resultado.meta.last_row_id;
}

export async function atualizarProduto(db, codigo, p) {
  const resultado = await db
    .prepare("UPDATE produto SET nome = ?, fabricante = ?, preco = ?, quantidade_estoque = ?, id_fornecedor = ? WHERE codigo = ?")
    .bind(p.nome, p.fabricante, p.preco, p.quantidade_estoque, p.id_fornecedor, codigo)
    .run();
  return resultado.meta.changes > 0;
}

export async function excluirProduto(db, codigo) {
  const resultado = await db.prepare("DELETE FROM produto WHERE codigo = ?").bind(codigo).run();
  return resultado.meta.changes > 0;
}
