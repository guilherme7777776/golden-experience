const { query } = require('../database');
const path = require('path');

console.log("VEJA A REPETIÇÃO DO RENDERIZAR TABELA PRODUTO")
exports.abrirCrudPagamento = (req, res) => {
  console.log("abrir  crud")
  res.sendFile(path.join(__dirname, '../../frontend/pagamento/pagamento.html'));
}
