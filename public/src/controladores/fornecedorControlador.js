// Operações HTTP de fornecedor: recebe a requisição, valida e chama a camada de dados

import { respostaJson, respostaErro, lerCorpoJson } from "../util/resposta.js";
import { idValido, validarFornecedor } from "../servicos/validacao.js";
import * as fornecedores from "../dados/fornecedorRepositorio.js";
import * as produtos from "../dados/produtoRepositorio.js";

export async function listar(env) {
  return respostaJson(await fornecedores.listarFornecedores(env.DB));
}

export async function listarProdutos(env, id) {
  if (!idValido(id)) return respostaErro("Código do fornecedor inválido.", 400);

  const fornecedor = await fornecedores.buscarFornecedorPorId(env.DB, id);
  if (!fornecedor) return respostaErro("Fornecedor não encontrado.", 404);

  const lista = await produtos.listarProdutosDoFornecedor(env.DB, id);
  return respostaJson({ fornecedor, produtos: lista });
}

export async function cadastrar(request, env) {
  const { erro, dados } = validarFornecedor(await lerCorpoJson(request));
  if (erro) return respostaErro(erro, 400);

  const id = await fornecedores.inserirFornecedor(env.DB, dados);
  return respostaJson({ mensagem: "Fornecedor cadastrado com sucesso!", id_fornecedor: id }, 201);
}

export async function atualizar(request, env, id) {
  if (!idValido(id)) return respostaErro("Código do fornecedor inválido.", 400);

  const { erro, dados } = validarFornecedor(await lerCorpoJson(request));
  if (erro) return respostaErro(erro, 400);

  const atualizado = await fornecedores.atualizarFornecedor(env.DB, id, dados);
  if (!atualizado) return respostaErro("Fornecedor não encontrado.", 404);

  return respostaJson({ mensagem: "Fornecedor atualizado com sucesso!", id_fornecedor: id });
}

export async function excluir(env, id) {
  if (!idValido(id)) return respostaErro("Código do fornecedor inválido.", 400);

  const total = await produtos.contarProdutosDoFornecedor(env.DB, id);
  if (total > 0) {
    return respostaErro("Não é possível excluir fornecedor com produtos associados.", 409);
  }

  const excluido = await fornecedores.excluirFornecedor(env.DB, id);
  if (!excluido) return respostaErro("Fornecedor não encontrado.", 404);

  return respostaJson({ mensagem: "Fornecedor excluído com sucesso!", id_fornecedor: id });
}
