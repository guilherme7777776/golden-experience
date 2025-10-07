SET search_path TO public;

-- DROP em ordem de dependência
DROP TABLE IF EXISTS PAGAMENTO CASCADE;
DROP TABLE IF EXISTS ITEM_CARRINHO CASCADE;
DROP TABLE IF EXISTS CARRINHO CASCADE;
DROP TABLE IF EXISTS CD CASCADE;
DROP TABLE IF EXISTS VINIL CASCADE;
DROP TABLE IF EXISTS CAMISETA CASCADE;
DROP TABLE IF EXISTS PRODUTO CASCADE;
DROP TABLE IF EXISTS FUNCIONARIO CASCADE;
DROP TABLE IF EXISTS CLIENTE CASCADE;
DROP TABLE IF EXISTS PESSOA CASCADE;

-- ========================
-- TABELA PESSOA
-- ========================
CREATE TABLE PESSOA (
    id_pessoa SERIAL PRIMARY KEY
);

-- ========================
-- TABELA CLIENTE
-- ========================
CREATE TABLE CLIENTE (
    id_pessoa INT PRIMARY KEY,
    nome_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(70) NOT NULL UNIQUE,
    senha_cliente VARCHAR(255) NOT NULL,
    endereco_cliente VARCHAR(100),
    telefone_cliente VARCHAR(20),
    data_nascimento DATE,
    FOREIGN KEY (id_pessoa) REFERENCES PESSOA(id_pessoa) ON DELETE CASCADE
);

-- ========================
-- TABELA FUNCIONARIO
-- ========================
CREATE TABLE FUNCIONARIO (
    id_pessoa INT PRIMARY KEY,
    nome_func VARCHAR(100) NOT NULL,
    email_func VARCHAR(70) NOT NULL UNIQUE,
    senha_func VARCHAR(255) NOT NULL,
    endereco_func VARCHAR(100),
    telefone_func VARCHAR(20),
    data_nascimento DATE,
    cargo VARCHAR(50),
    salario DECIMAL(10,2),
    carga_horaria INT,
    FOREIGN KEY (id_pessoa) REFERENCES PESSOA(id_pessoa) ON DELETE CASCADE
);

-- ========================
-- TABELA PRODUTO
-- ========================
CREATE TABLE PRODUTO (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    id_funcionario INT,
    FOREIGN KEY (id_funcionario) REFERENCES FUNCIONARIO(id_pessoa) ON DELETE SET NULL
);

-- ========================
-- TABELAS ESPECIALIZADAS DE PRODUTO
-- ========================
CREATE TABLE CAMISETA (
    id_produto INT PRIMARY KEY,
    FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

CREATE TABLE VINIL (
    id_produto INT PRIMARY KEY,
    FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

CREATE TABLE CD (
    id_produto INT PRIMARY KEY,
    FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

-- ========================
-- TABELA CARRINHO
-- ========================
CREATE TABLE CARRINHO (
    id_carrinho SERIAL PRIMARY KEY,
    id_pessoa INT NOT NULL,
    FOREIGN KEY (id_pessoa) REFERENCES PESSOA(id_pessoa) ON DELETE CASCADE
);

-- ========================
-- TABELA ITEM_CARRINHO
-- ========================
CREATE TABLE ITEM_CARRINHO (
    id_item SERIAL PRIMARY KEY,
    id_carrinho INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    FOREIGN KEY (id_carrinho) REFERENCES CARRINHO(id_carrinho) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

-- ========================
-- TABELA PAGAMENTO
-- ========================
CREATE TABLE PAGAMENTO (
    id_pagamento SERIAL PRIMARY KEY,
    id_carrinho INT UNIQUE NOT NULL,
    forma_pagamento VARCHAR(50),
    valor_total DECIMAL(10,2) NOT NULL CHECK (valor_total >= 0),
    data_pagamento DATE NOT NULL,
    FOREIGN KEY (id_carrinho) REFERENCES CARRINHO(id_carrinho) ON DELETE CASCADE
);

-- ========================
-- INSERÇÃO DE DADOS
-- ========================

-- PESSOAS
INSERT INTO PESSOA (id_pessoa) VALUES
(1),(2),(3),(4),(5),(6),(7),(8);

-- CLIENTES
INSERT INTO CLIENTE (id_pessoa, nome_cliente, email_cliente, senha_cliente, endereco_cliente, telefone_cliente, data_nascimento) VALUES
(1, 'Lara Viana', 'lara.viana@email.com', 'senhaLara123', 'Av. das Flores, 123', '11988887777', '1992-03-10'),
(2, 'Mateus Ribeiro', 'mateus.ribeiro@email.com', 'senhaMateus456', 'Rua das Acácias, 45', '11988887778', '1989-07-22'),
(3, 'Camila Nunes', 'camila.nunes@email.com', 'senhaCamila789', 'Rua dos Lírios, 78', '11988887779', '1991-11-05'),
(4, 'Felipe Souza', 'felipe.souza@email.com', 'senhaFelipe101', 'Alameda Santos, 101', '11988887780', '1990-02-14'),
(5, 'Mariana Alves', 'mariana.alves@email.com', 'senhaMariana202', 'Rua Primavera, 202', '11988887781', '1993-05-19');

-- FUNCIONARIOS
INSERT INTO FUNCIONARIO (id_pessoa, nome_func, email_func, senha_func, endereco_func, telefone_func, data_nascimento, cargo, salario, carga_horaria) VALUES
(6, 'Ricardo Lima', 'ricardo.lima@email.com', 'senhaRicardo303', 'Av. Paulista, 303', '11988887782', '1985-06-12', 'Funcionário', 2800.00, 40),
(7, 'Sofia Martins', 'sofia.martins@email.com', 'senhaSofia404', 'Rua das Palmeiras, 404', '11988887783', '1987-09-18', 'Funcionário', 2800.00, 40),
(8, 'Thiago Carvalho', 'thiago.carvalho@email.com', 'senhaThiago505', 'Av. Brasil, 505', '11988887784', '1983-12-03', 'Gerente', 5000.00, 40);

-- PRODUTOS
INSERT INTO PRODUTO (nome, preco, id_funcionario) VALUES
('Camiseta Rock', 79.90, 6),
('Vinil Metallica - Master of Puppets', 129.90, 7),
('CD Angra - Temple of Shadows', 49.90, 6),
('Camiseta Jazz', 89.90, 7),
('Vinil Beatles - Revolver', 139.90, 8),
('King Crimson - In the Court of the Crimson King', 249.90, 6),
('Vinil Megadeth - Rust in Peace', 149.90, 7),
('CD Metallica - Ride the Lightning', 69.90, 6),
('Vinil Pink Floyd - Dark Side of the Moon', 159.90, 7),
('CD Queen - A Night at the Opera', 59.90, 6);

-- CAMISETAS
INSERT INTO CAMISETA (id_produto) VALUES (1),(4);

-- VINIS
INSERT INTO VINIL (id_produto) VALUES (2),(5),(7),(9);

-- CDS
INSERT INTO CD (id_produto) VALUES (3),(6),(8),(10);

-- CARRINHOS
INSERT INTO CARRINHO (id_pessoa) VALUES (1),(2),(6),(7);

-- ITENS CARRINHO
INSERT INTO ITEM_CARRINHO (id_carrinho, id_produto, quantidade) VALUES
(1,1,2),
(1,3,1),
(2,2,1),
(2,4,2),
(3,5,1);

-- PAGAMENTOS
INSERT INTO PAGAMENTO (id_carrinho, forma_pagamento, valor_total, data_pagamento) VALUES
(1, 'Cartão de Crédito', 209.70, '2025-09-10'),
(2, 'Boleto', 309.80, '2025-09-11'),
(3, 'Pix', 139.90, '2025-09-12');
