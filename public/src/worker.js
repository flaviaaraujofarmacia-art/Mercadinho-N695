// Ponto de entrada do Worker do Mercadinho N695 (Cloudflare)
// Só direciona cada requisição para o controlador certo.
// As telas da pasta "public" são entregues automaticamente pelo Cloudflare.

import * as fornecedor from "./controladores/fornecedorControlador.js";
import * as produto from "./controladores/produtoControlador.js";
import { respostaErro } from "./util/resposta.js";

function rotearFornecedores(request, env, partes) {
  const [, idTexto, subrecurso] = partes;
  const id = Number(idTexto);
  const metodo = request.method;

  if (partes.length === 1 && metodo === "GET") return fornecedor.listar(env);
  if (partes.length === 1 && metodo === "POST") return fornecedor.cadastrar(request, env);
  if (partes.length === 3 && subrecurso === "produtos" && metodo === "GET") {
    return fornecedor.listarProdutos(env, id);
  }
  if (partes.length === 2 && metodo === "PUT") return fornecedor.atualizar(request, env, id);
  if (partes.length === 2 && metodo === "DELETE") return fornecedor.excluir(env, id);
  return null;
}

function rotearProdutos(request, env, partes) {
  const codigo = Number(partes[1]);
  const metodo = request.method;

  if (partes.length === 1 && metodo === "GET") return produto.listar(env);
  if (partes.length === 1 && metodo === "POST") return produto.cadastrar(request, env);
  if (partes.length === 2 && metodo === "PUT") return produto.atualizar(request, env, codigo);
  if (partes.length === 2 && metodo === "DELETE") return produto.excluir(env, codigo);
  return null;
}

function traduzirErroDoBanco(erro) {
  const texto = String(erro && erro.message);
  if (texto.includes("UNIQUE") && texto.includes("cnpj")) {
    return respostaErro("Já existe um fornecedor com esse CNPJ.", 409);
  }
  if (texto.includes("UNIQUE") && texto.includes("produto")) {
    return respostaErro("Já existe um produto com esse nome e fabricante.", 409);
  }
  if (texto.includes("FOREIGN KEY")) {
    return respostaErro("Não é possível concluir: o registro está ligado a outros dados (ex.: compras).", 409);
  }
  console.error("Erro inesperado:", erro);
  return respostaErro("Erro ao acessar o banco de dados.", 500);
}

export default {
  async fetch(request, env) {
    const partes = new URL(request.url).pathname.split("/").filter(Boolean);
    const roteadores = { fornecedores: rotearFornecedores, produtos: rotearProdutos };
    const rotear = roteadores[partes[0]];

    if (rotear) {
      try {
        const resposta = await rotear(request, env, partes);
        return resposta ?? respostaErro("Rota ou método não permitido.", 405);
      } catch (erro) {
        return traduzirErroDoBanco(erro);
      }
    }

    return env.ASSETS.fetch(request);
  }
};
