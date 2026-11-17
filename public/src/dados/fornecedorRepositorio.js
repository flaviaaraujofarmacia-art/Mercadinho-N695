// Acesso aos dados da tabela fornecedor (camada de dados, banco D1)

export async function listarFornecedores(db) {
  const { results } = await db.prepare("SELECT * FROM fornecedor ORDER BY id_fornecedor").all();
  return results;
}

export async function buscarFornecedorPorId(db, id) {
  return db.prepare("SELECT * FROM fornecedor WHERE id_fornecedor = ?").bind(id).first();
}

export async function inserirFornecedor(db, f) {
  const resultado = await db
    .prepare("INSERT INTO fornecedor (razao_social, cnpj, telefone, email) VALUES (?, ?, ?, ?)")
    .bind(f.razao_social, f.cnpj, f.telefone, f.email)
    .run();
  return resultado.meta.last_row_id;
}

export async function atualizarFornecedor(db, id, f) {
  const resultado = await db
    .prepare("UPDATE fornecedor SET razao_social = ?, cnpj = ?, telefone = ?, email = ? WHERE id_fornecedor = ?")
    .bind(f.razao_social, f.cnpj, f.telefone, f.email, id)
    .run();
  return resultado.meta.changes > 0;
}

export async function excluirFornecedor(db, id) {
  const resultado = await db.prepare("DELETE FROM fornecedor WHERE id_fornecedor = ?").bind(id).run();
  return resultado.meta.changes > 0;
}
