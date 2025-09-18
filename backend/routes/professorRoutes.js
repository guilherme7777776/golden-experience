const express = require('express');
const router = express.Router();
const gerenteController = require('../controllers/gerenteController');

// CRUD de gerentes


router.get('/', gerenteController.listargerente);
router.post('/', gerenteController.criargerente);
router.get('/:id', gerenteController.obtergerente);
router.put('/:id', gerenteController.atualizargerente);
router.delete('/:id', gerenteController.deletargerente);

module.exports = router;
