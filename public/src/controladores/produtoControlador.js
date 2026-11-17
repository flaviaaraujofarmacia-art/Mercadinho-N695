// Operações HTTP de produto: recebe a requisição, valida e chama a camada de dados

import { respostaJson, respostaErro, lerCorpoJson } from "../util/resposta.js";
import { idValido, validarProduto } from "../servicos/validacao.js";
import * as produtos from "../dados/produtoRepositorio.js";
import { buscarFornecedorPorId } from "../dados/fornecedorRepositorio.js";

async function validarComFornecedor(request, env) {
  const { erro, dados } = validarProduto(await lerCorpoJson(request));
  if (erro) return { erro };

  const fornecedor = await buscarFornecedorPorId(env.DB, dados.id_fornecedor);
  if (!fornecedor) return { erro: "Fornecedor não encontrado." };

  return { dados };
}

export async function listar(env) {
  return respostaJson(await produtos.listarProdutos(env.DB));
}

export async function cadastrar(request, env) {
  const { erro, dados } = await validarComFornecedor(request, env);
  if (erro) return respostaErro(erro, 400);

  const codigo = await produtos.inserirProduto(env.DB, dados);
  return respostaJson({ mensagem: "Produto cadastrado com sucesso!", codigo }, 201);
}

export async function atualizar(request, env, codigo) {
  if (!idValido(codigo)) return respostaErro("Código do produto inválido.", 400);

  const { erro, dados } = await validarComFornecedor(request, env);
  if (erro) return respostaErro(erro, 400);

  const atualizado = await produtos.atualizarProduto(env.DB, codigo, dados);
  if (!atualizado) return respostaErro("Produto não encontrado.", 404);

  return respostaJson({ mensagem: "Produto atualizado com sucesso!", codigo });
}

export async function excluir(env, codigo) {
  if (!idValido(codigo)) return respostaErro("Código do produto inválido.", 400);

  const excluido = await produtos.excluirProduto(env.DB, codigo);
  if (!excluido) return respostaErro("Produto não encontrado.", 404);

  return respostaJson({ mensagem: "Produto excluído com sucesso!", codigo });
}
