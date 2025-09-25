const { query } = require('../database');
const path = require('path');

exports.abrirCrudPagamento = (req, res) => {
  console.log("abrir  crud")
  res.sendFile(path.join(__dirname, '../../frontend/pagamento/pagamento.html'));
}
