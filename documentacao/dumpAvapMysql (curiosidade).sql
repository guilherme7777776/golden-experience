/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- ================================
-- TABELA PESSOA
-- ================================
DROP TABLE IF EXISTS `pessoa`;
CREATE TABLE `pessoa` (
  `id_pessoa` INT NOT NULL AUTO_INCREMENT,
  `nome_pessoa` VARCHAR(100) NOT NULL,
  `email_pessoa` VARCHAR(70) NOT NULL UNIQUE,
  `senha_pessoa` VARCHAR(32) NOT NULL,
  `primeiro_acesso_pessoa` TINYINT(1) NOT NULL DEFAULT '1',
  `data_nascimento` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id_pessoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `pessoa` WRITE;
/*!40000 ALTER TABLE `pessoa` DISABLE KEYS */;
INSERT INTO `pessoa` VALUES 
(1,'João da Silva','joao@email.com','123456',1,'2000-01-01 00:00:00'),
(2,'Maria Souza','maria@email.com','654321',1,'1998-05-20 00:00:00'),
(3,'Carlos Funcionário','carlos@loja.com','admin123',0,'1990-09-15 00:00:00');
/*!40000 ALTER TABLE `pessoa` ENABLE KEYS */;
UNLOCK TABLES;

-- ================================
-- TABELA PRODUTO
-- ================================
DROP TABLE IF EXISTS `produto`;
CREATE TABLE `produto` (
  `id_produto` INT NOT NULL AUTO_INCREMENT,
  `nome_produto` VARCHAR(100) NOT NULL,
  `preco` DECIMAL(10,2) NOT NULL,
  `categoria` ENUM('Camiseta','Vinil','CD') NOT NULL,
  `funcionario_id` INT NOT NULL,
  PRIMARY KEY (`id_produto`),
  KEY `fk_produto_funcionario_idx` (`funcionario_id`),
  CONSTRAINT `fk_produto_funcionario` FOREIGN KEY (`funcionario_id`) 
    REFERENCES `pessoa` (`id_pessoa`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `produto` WRITE;
/*!40000 ALTER TABLE `produto` DISABLE KEYS */;
INSERT INTO `produto` VALUES
(1,'Camiseta Preta Banda',79.90,'Camiseta',3),
(2,'Vinil - King Crimson - In the Court of the Crimson King',199.90,'Vinil',3),
(3,'Vinil - Megadeth - Rust in Peace',189.90,'Vinil',3),
(4,'CD - Black Sabbath - Master of Reality',49.90,'CD',3),
(5,'CD - Ghost - Impera',59.90,'CD',3);
/*!40000 ALTER TABLE `produto` ENABLE KEYS */;
UNLOCK TABLES;

-- ================================
-- TABELA CARRINHO
-- ================================
DROP TABLE IF EXISTS `carrinho`;
CREATE TABLE `carrinho` (
  `id_carrinho` INT NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT NOT NULL,
  PRIMARY KEY (`id_carrinho`),
  KEY `fk_carrinho_pessoa_idx` (`pessoa_id`),
  CONSTRAINT `fk_carrinho_pessoa` FOREIGN KEY (`pessoa_id`) 
    REFERENCES `pessoa` (`id_pessoa`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `carrinho` WRITE;
/*!40000 ALTER TABLE `carrinho` DISABLE KEYS */;
INSERT INTO `carrinho` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `carrinho` ENABLE KEYS */;
UNLOCK TABLES;

-- ================================
-- TABELA ITEM_CARRINHO
-- ================================
DROP TABLE IF EXISTS `item_carrinho`;
CREATE TABLE `item_carrinho` (
  `carrinho_id` INT NOT NULL,
  `produto_id` INT NOT NULL,
  `quantidade` INT NOT NULL CHECK (`quantidade` > 0),
  PRIMARY KEY (`carrinho_id`,`produto_id`),
  KEY `fk_item_carrinho_produto_idx` (`produto_id`),
  CONSTRAINT `fk_item_carrinho_carrinho` FOREIGN KEY (`carrinho_id`) 
    REFERENCES `carrinho` (`id_carrinho`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_item_carrinho_produto` FOREIGN KEY (`produto_id`) 
    REFERENCES `produto` (`id_produto`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `item_carrinho` WRITE;
/*!40000 ALTER TABLE `item_carrinho` DISABLE KEYS */;
INSERT INTO `item_carrinho` VALUES 
(1,1,2),(1,4,1),(2,2,1),(2,3,1);
/*!40000 ALTER TABLE `item_carrinho` ENABLE KEYS */;
UNLOCK TABLES;

-- ================================
-- TABELA PAGAMENTO
-- ================================
DROP TABLE IF EXISTS `pagamento`;
CREATE TABLE `pagamento` (
  `carrinho_id` INT NOT NULL,
  `valor_total` DECIMAL(10,2) NOT NULL,
  `forma_pagamento` ENUM('Pix','Cartão','Dinheiro') NOT NULL,
  PRIMARY KEY (`carrinho_id`),
  CONSTRAINT `fk_pagamento_carrinho` FOREIGN KEY (`carrinho_id`) 
    REFERENCES `carrinho` (`id_carrinho`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `pagamento` WRITE;
/*!40000 ALTER TABLE `pagamento` DISABLE KEYS */;
INSERT INTO `pagamento` VALUES (1,209.70,'Pix'),(2,389.80,'Cartão');
/*!40000 ALTER TABLE `pagamento` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
