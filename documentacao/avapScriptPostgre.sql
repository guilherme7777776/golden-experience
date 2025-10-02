SET search_path TO public;

-- ========================
-- TABELA PESSOA
-- ========================
CREATE TABLE PESSOA (
    id_pessoa INT PRIMARY KEY,
    nome_pessoa VARCHAR(100) NOT NULL,
    email_pessoa VARCHAR(70) NOT NULL UNIQUE,
    senha_pessoa VARCHAR(255) NOT NULL, -- suporta hash Bcrypt/Argon2
    endereco_pessoa VARCHAR(100),
    telefone_pessoa VARCHAR(20),
    data_nascimento DATE
);

CREATE TABLE CLIENTE (
    id_pessoa INT PRIMARY KEY,
    FOREIGN KEY (id_pessoa) REFERENCES PESSOA(id_pessoa) ON DELETE CASCADE
);

CREATE TABLE FUNCIONARIO (
    id_pessoa INT PRIMARY KEY,
    cargo VARCHAR(50),
    FOREIGN KEY (id_pessoa) REFERENCES PESSOA(id_pessoa) ON DELETE CASCADE
);

CREATE TABLE GERENTE (
    id_pessoa INT PRIMARY KEY,
    FOREIGN KEY (id_pessoa) REFERENCES FUNCIONARIO(id_pessoa) ON DELETE CASCADE
);

CREATE TABLE PRODUTO (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    f_id_pessoa INT,
    FOREIGN KEY (f_id_pessoa) REFERENCES FUNCIONARIO(id_pessoa) ON DELETE SET NULL
);

CREATE TABLE CAMISETA (
    id_produto INT PRIMARY KEY,
    FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

CREATE TABLE VINIL (
    id_produto INT PRIMARY KEY,
    artista VARCHAR(100),
    FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

CREATE TABLE CD (
    id_produto INT PRIMARY KEY,
    artista VARCHAR(100),
    FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

CREATE TABLE CARRINHO (
    id_carrinho SERIAL PRIMARY KEY,
    c_id_pessoa INT,
    FOREIGN KEY (c_id_pessoa) REFERENCES CLIENTE(id_pessoa) ON DELETE CASCADE
);

CREATE TABLE ITEM_CARRINHO (
    id_item SERIAL PRIMARY KEY,
    id_carrinho INT,
    id_produto INT,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    FOREIGN KEY (id_carrinho) REFERENCES CARRINHO(id_carrinho) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

CREATE TABLE PAGAMENTO (
    id_pagamento SERIAL PRIMARY KEY,
    id_carrinho INT UNIQUE,
    forma_pagamento VARCHAR(50),
    valor_total DECIMAL(10,2) NOT NULL CHECK (valor_total >= 0),
    data_pagamento DATE NOT NULL,
    FOREIGN KEY (id_carrinho) REFERENCES CARRINHO(id_carrinho) ON DELETE CASCADE
);

-- ========================
-- INSERÇÃO DE DADOS
-- ========================

-- PESSOAS
INSERT INTO PESSOA (id_pessoa, nome_pessoa, email_pessoa, senha_pessoa, endereco_pessoa, telefone_pessoa, data_nascimento) VALUES
(1, 'João da Silva', 'joao@email.com', 'hash1', 'Rua A, 123', '11999990001', '1990-01-15'),
(2, 'Bruno Souza', 'bruno@email.com', 'hash2', 'Rua B, 456', '11999990002', '1988-06-23'),
(3, 'Carlos Lima', 'carlos@email.com', 'hash3', 'Rua C, 789', '11999990003', '1992-09-12'),
(4, 'Daniela Castro', 'daniela@email.com', 'hash4', 'Rua D, 101', '11999990004', '1995-04-05'),
(5, 'Eduardo Alves', 'eduardo@email.com', 'hash5', 'Rua E, 202', '11999990005', '1991-11-20'),
(6, 'Fernanda Rocha', 'fernanda@email.com', 'hash6', 'Rua F, 303', '11999990006', '1985-02-28'),
(7, 'Gustavo Melo', 'gustavo@email.com', 'hash7', 'Rua G, 404', '11999990007', '1989-07-17'),
(8, 'Helena Martins', 'helena@email.com', 'hash8', 'Rua H, 505', '11999990008', '1993-12-01'),
(9, 'Igor Ferreira', 'igor@email.com', 'hash9', 'Rua I, 606', '11999990009', '1990-10-30'),
(10, 'Juliana Dias', 'juliana@email.com', 'hash10', 'Rua J, 707', '11999990010', '1994-08-14');

-- CLIENTES
INSERT INTO CLIENTE (id_pessoa) VALUES
(1), (2), (3), (4), (5);

-- FUNCIONARIOS
INSERT INTO FUNCIONARIO (id_pessoa, cargo) VALUES
(6, 'Funcionário'),
(7, 'Funcionário'),
(8, 'Gerente');

-- GERENTE
INSERT INTO GERENTE (id_pessoa) VALUES
(8);

-- PRODUTOS
INSERT INTO PRODUTO (id_produto, nome, preco, f_id_pessoa) VALUES
(1, 'Camiseta Rock', 79.90, 6),
(2, 'Vinil Metallica - Master of Puppets', 129.90, 7),
(3, 'CD Angra - Temple of Shadows', 49.90, 6),
(4, 'Camiseta Jazz', 89.90, 7),
(5, 'Vinil Beatles - Revolver', 139.90, 8),
(6, 'King Crimson - In the Court of the Crimson King', 249.90, 6),
(7, 'Vinil Megadeth - Rust in Peace', 149.90, 7),
(8, 'CD Metallica - Ride the Lightning', 69.90, 6),
(9, 'Vinil Pink Floyd - Dark Side of the Moon', 159.90, 7),
(10, 'CD Queen - A Night at the Opera', 59.90, 6);

-- CAMISETAS
INSERT INTO CAMISETA (id_produto) VALUES
(1),
(4);

-- VINIS
INSERT INTO VINIL (id_produto, artista) VALUES
(2, 'Metallica'),
(5, 'The Beatles'),
(7, 'Megadeth'),
(9, 'Pink Floyd');

-- CDS
INSERT INTO CD (id_produto, artista) VALUES
(3, 'Angra'),
(6, 'King Crimson'),
(8, 'Metallica'),
(10, 'Queen');

-- CARRINHOS
INSERT INTO CARRINHO (id_carrinho, c_id_pessoa) VALUES
(1, 1),
(2, 2),
(3, 3);

-- ITENS CARRINHO
INSERT INTO ITEM_CARRINHO (id_item, id_carrinho, id_produto, quantidade) VALUES
(1, 1, 1, 2),
(2, 1, 3, 1),
(3, 2, 2, 1),
(4, 2, 4, 2),
(5, 3, 5, 1);

-- PAGAMENTOS
INSERT INTO PAGAMENTO (id_pagamento, id_carrinho, forma_pagamento, valor_total, data_pagamento) VALUES
(1, 1, 'Cartão de Crédito', 209.70, '2025-09-10'),
(2, 2, 'Boleto', 309.80, '2025-09-11'),
(3, 3, 'Pix', 139.90, '2025-09-12');
