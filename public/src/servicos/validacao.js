// Regras de validação do cenário (camada de serviço)
// Cada função devolve { erro } quando algo está errado, ou { dados } já limpos.

function estaVazio(valor) {
  return valor === undefined || valor === null || valor === "";
}

function textoPreenchido(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

export function idValido(id) {
  return Number.isInteger(id) && id > 0;
}

export function cnpjValido(cnpj) {
  return typeof cnpj === "string" && /^\d{14}$/.test(cnpj);
}

export function validarFornecedor({ razao_social, cnpj, telefone, email }) {
  if (!textoPreenchido(razao_social)) {
    return { erro: "A razão social é obrigatória." };
  }
  if (!cnpjValido(cnpj)) {
    return { erro: "O CNPJ deve ter exatamente 14 dígitos numéricos." };
  }
  return {
    dados: {
      razao_social: razao_social.trim(),
      cnpj,
      telefone: textoPreenchido(telefone) ? telefone.trim() : null,
      email: textoPreenchido(email) ? email.trim() : null
    }
  };
}

export function validarProduto({ nome, fabricante, preco, quantidade_estoque, id_fornecedor }) {
  if (
    !textoPreenchido(nome) || !textoPreenchido(fabricante) ||
    estaVazio(preco) || estaVazio(quantidade_estoque) || estaVazio(id_fornecedor)
  ) {
    return { erro: "Todos os campos do produto são obrigatórios." };
  }

  const precoNumero = Number(preco);
  const estoqueNumero = Number(quantidade_estoque);
  const fornecedorId = Number(id_fornecedor);

  if (!Number.isFinite(precoNumero) || precoNumero < 0) {
    return { erro: "O preço deve ser um número válido e não negativo." };
  }
  if (!Number.isInteger(estoqueNumero) || estoqueNumero < 0) {
    return { erro: "A quantidade em estoque não pode ser negativa." };
  }
  if (!idValido(fornecedorId)) {
    return { erro: "Fornecedor inválido." };
  }

  return {
    dados: {
      nome: nome.trim(),
      fabricante: fabricante.trim(),
      preco: precoNumero,
      quantidade_estoque: estoqueNumero,
      id_fornecedor: fornecedorId
    }
  };
}
