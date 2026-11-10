const db = require("./db");

async function testarConexao() {
  try {
    const [resultado] = await db.query("SELECT 1 AS teste");

    console.log("Conexão com MySQL realizada com sucesso!");
    console.log(resultado);
  } catch (erro) {
    console.error("Erro ao conectar ao MySQL:", erro.message);
  } finally {
    await db.end();
  }
}

testarConexao();