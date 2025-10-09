const express = require('express');
const router = express.Router();
const itemCarrinhoController = require('../controllers/item_carrinhoController');

// Abrir CRUD (HTML)
router.get('/abrirCrudItemCarrinho', itemCarrinhoController.abrirCrudItemCarrinho);

// Listar todos os itens do carrinho
router.get('/', itemCarrinhoController.listarItensCarrinho);

// Criar novo item no carrinho
router.post('/', itemCarrinhoController.criarItemCarrinho);

// Obter todos os itens de um carrinho específico
router.get('/carrinho/:idCarrinho', itemCarrinhoController.obterItensDoCarrinho);

// Obter um item específico pelo id_item
router.get('/:id_item', itemCarrinhoController.obterItemCarrinho);

// Atualizar item do carrinho pelo id_item
router.put('/:id_item', itemCarrinhoController.atualizarItemCarrinho);

// Deletar item do carrinho pelo id_item
router.delete('/:id_item', itemCarrinhoController.deletarItemCarrinho);

module.exports = router;
