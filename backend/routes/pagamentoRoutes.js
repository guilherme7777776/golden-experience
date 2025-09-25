const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');

router.get('/abrirCrudPagamento', pagamentoController.abrirCrudPagamento);


module.exports = router;
