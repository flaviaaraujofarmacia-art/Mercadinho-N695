// Monta respostas HTTP em JSON (usado por todos os controladores)

export function respostaJson(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

export function respostaErro(mensagem, status) {
  return respostaJson({ mensagem }, status);
}

export async function lerCorpoJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
