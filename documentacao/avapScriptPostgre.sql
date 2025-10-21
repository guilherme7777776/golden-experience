-- Set schema
SET search_path TO public;

-- DROP em ordem de dependência
DROP TABLE IF EXISTS PAGAMENTO_HAS_FORMA_PAGAMENTO CASCADE;
DROP TABLE IF EXISTS PAGAMENTO CASCADE;
DROP TABLE IF EXISTS ITEM_CARRINHO CASCADE;
DROP TABLE IF EXISTS CARRINHO CASCADE;
DROP TABLE IF EXISTS CD CASCADE;
DROP TABLE IF EXISTS VINIL CASCADE;
DROP TABLE IF EXISTS CAMISETA CASCADE;
DROP TABLE IF EXISTS PRODUTO CASCADE;
DROP TABLE IF EXISTS GERENTE CASCADE;
DROP TABLE IF EXISTS FUNCIONARIO CASCADE;
DROP TABLE IF EXISTS CARGO CASCADE;
DROP TABLE IF EXISTS CLIENTE CASCADE;
DROP TABLE IF EXISTS FORMA_PAGAMENTO CASCADE;
DROP TABLE IF EXISTS PESSOA CASCADE;

-- ========================
-- TABELAS
-- ========================

CREATE TABLE PESSOA (
id_pessoa INT PRIMARY KEY
);

CREATE TABLE CLIENTE (
id_pessoa INT PRIMARY KEY,
nome_cliente VARCHAR(100) NOT NULL,
email_cliente VARCHAR(70) NOT NULL,
senha_cliente VARCHAR(255) NOT NULL,
endereco_cliente VARCHAR(100),
telefone_cliente VARCHAR(20),
data_nascimento DATE,
renda_cliente DECIMAL(10,2),
data_cadastro DATE,
FOREIGN KEY (id_pessoa) REFERENCES PESSOA(id_pessoa) ON DELETE CASCADE
);

CREATE TABLE CARGO (
id_cargo SERIAL PRIMARY KEY,
nome_cargo VARCHAR(50) NOT NULL
);

CREATE TABLE FUNCIONARIO (
id_pessoa INT PRIMARY KEY,
nome_func VARCHAR(100) NOT NULL,
email_func VARCHAR(70) NOT NULL UNIQUE,
senha_func VARCHAR(255) NOT NULL,
endereco_func VARCHAR(100),
telefone_func VARCHAR(20),
data_nascimento DATE,
salario DECIMAL(10,2),
carga_horaria NUMERIC(5,2) CHECK (carga_horaria > 0),
id_cargo INT,
FOREIGN KEY (id_pessoa) REFERENCES PESSOA(id_pessoa) ON DELETE CASCADE,
FOREIGN KEY (id_cargo) REFERENCES CARGO(id_cargo) ON DELETE SET NULL
);

CREATE TABLE GERENTE (
id_pessoa INT PRIMARY KEY,
FOREIGN KEY (id_pessoa) REFERENCES FUNCIONARIO(id_pessoa) ON DELETE CASCADE
);

CREATE TABLE PRODUTO (
id_produto SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
id_funcionario INT,
FOREIGN KEY (id_funcionario) REFERENCES FUNCIONARIO(id_pessoa) ON DELETE SET NULL
);

CREATE TABLE CAMISETA (
id_produto INT PRIMARY KEY,
tamanho VARCHAR(10),
cor VARCHAR(20),
FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

CREATE TABLE VINIL (
id_produto INT PRIMARY KEY,
ano_lancamento INT,
FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

CREATE TABLE CD (
id_produto INT PRIMARY KEY,
duracao_minutos INT,
FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

CREATE TABLE CARRINHO (
id_carrinho SERIAL PRIMARY KEY,
id_funcionario INT NOT NULL,
data_pedido DATE,
id_pessoa INT NOT NULL,
FOREIGN KEY (id_pessoa) REFERENCES PESSOA(id_pessoa) ON DELETE CASCADE,
FOREIGN KEY (id_funcionario) REFERENCES FUNCIONARIO(id_pessoa) ON DELETE CASCADE
);

CREATE TABLE ITEM_CARRINHO (
id_item SERIAL PRIMARY KEY,
id_carrinho INT NOT NULL,
id_produto INT NOT NULL,
quantidade INT NOT NULL CHECK (quantidade > 0),
preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario >= 0),
FOREIGN KEY (id_carrinho) REFERENCES CARRINHO(id_carrinho) ON DELETE CASCADE,
FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE
);

CREATE TABLE FORMA_PAGAMENTO (
id_forma_pagamento SERIAL PRIMARY KEY,
nome_forma_pagamento VARCHAR(50) NOT NULL
);

CREATE TABLE PAGAMENTO (
id_pagamento SERIAL PRIMARY KEY,
id_carrinho INT UNIQUE NOT NULL,
valor_total DECIMAL(10,2) NOT NULL CHECK (valor_total >= 0),
data_pagamento TIMESTAMP NOT NULL,
FOREIGN KEY (id_carrinho) REFERENCES CARRINHO(id_carrinho) ON DELETE CASCADE
);

CREATE TABLE PAGAMENTO_HAS_FORMA_PAGAMENTO (
id_pagamento INT NOT NULL,
id_forma_pagamento INT NOT NULL,
valor_pago DECIMAL(10,2) NOT NULL CHECK (valor_pago >= 0),
PRIMARY KEY (id_pagamento, id_forma_pagamento),
FOREIGN KEY (id_pagamento) REFERENCES PAGAMENTO(id_pagamento) ON DELETE CASCADE,
FOREIGN KEY (id_forma_pagamento) REFERENCES FORMA_PAGAMENTO(id_forma_pagamento) ON DELETE CASCADE
);

-- PESSOA
INSERT INTO PESSOA (id_pessoa) VALUES
(1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

-- CARGO
INSERT INTO CARGO (nome_cargo) VALUES
('Vendedor'), ('Gerente'), ('Caixa');

-- FUNCIONARIO
INSERT INTO FUNCIONARIO (
    id_pessoa, nome_func, email_func, senha_func, endereco_func,
    telefone_func, data_nascimento, salario, carga_horaria, id_cargo
) VALUES
(1, 'João Silva', 'joao@empresa.com', 'senha123', 'Rua A, 10', '99990001', '1985-05-10', 3000.00, 44.0, 1),
(2, 'Maria Santos', 'maria@empresa.com', 'senha456', 'Rua B, 20', '99990002', '1990-07-15', 4000.00, 40.0, 2),
(3, 'Carlos Lima', 'carlos@empresa.com', 'senha789', 'Rua C, 30', '99990003', '1988-03-22', 2500.00, 36.0, 1),
(7, 'Fabio Souza', 'fabio@empresa.com', 'senha321', 'Rua G, 70', '99990004', '1983-01-05', 3500.00, 42.0, 2),
(8, 'Gabriela Alves', 'gabriela@empresa.com', 'senha654', 'Rua H, 80', '99990005', '1991-09-10', 3200.00, 40.0, 1),
(9, 'Helena Martins', 'helena@empresa.com', 'senha987', 'Rua I, 90', '99990006', '1987-12-20', 3100.00, 38.0, 1),
(10, 'Igor Campos', 'igor@empresa.com', 'senha159', 'Rua J, 100', '99990007', '1986-06-25', 3600.00, 44.0, 3);

-- GERENTE
INSERT INTO GERENTE (id_pessoa) VALUES
(2), (7);

-- CLIENTE
INSERT INTO CLIENTE (
    id_pessoa, nome_cliente, email_cliente, senha_cliente, endereco_cliente,
    telefone_cliente, data_nascimento, renda_cliente, data_cadastro
) VALUES
(4, 'Ana Pereira', 'ana@cliente.com', 'senha111', 'Rua D, 40', '88880001', '1992-02-20', 5000.00, '2025-10-10'),
(5, 'Bruno Costa', 'bruno@cliente.com', 'senha222', 'Rua E, 50', '88880002', '1987-11-05', 7000.00, '2025-10-11'),
(6, 'Carla Rocha', 'carla@cliente.com', 'senha333', 'Rua F, 60', '88880003', '1995-08-30', 3000.00, '2025-10-12');

-- FORMA_PAGAMENTO
INSERT INTO FORMA_PAGAMENTO (nome_forma_pagamento) VALUES
('Cartão de Crédito'),
('Boleto Bancário'),
('Pix'),
('Dinheiro');

-- PRODUTO
INSERT INTO PRODUTO (id_produto, nome, preco, id_funcionario) VALUES
(1, 'Camiseta Rock', 79.90, 1),
(2, 'Vinil Metallica', 129.90, 2),
(3, 'CD Angra', 49.90, 1);

-- CAMISETA
INSERT INTO CAMISETA (id_produto, tamanho, cor) VALUES
(1, 'M', 'preto');

-- VINIL
INSERT INTO VINIL (id_produto, ano_lancamento) VALUES
(2, 1986);

-- CD
INSERT INTO CD (id_produto, duracao_minutos) VALUES
(3, 75);

-- CARRINHO
INSERT INTO CARRINHO (id_funcionario, data_pedido, id_pessoa) VALUES
(1, '2025-10-13', 4),
(2, '2025-10-14', 5);

-- ITEM_CARRINHO
INSERT INTO ITEM_CARRINHO (id_carrinho, id_produto, quantidade, preco_unitario) VALUES
(1, 1, 2, 79.90),
(1, 3, 1, 49.90),
(2, 2, 1, 129.90);

-- PAGAMENTO
INSERT INTO PAGAMENTO (id_carrinho, valor_total, data_pagamento) VALUES
(1, 209.70, '2025-10-13 14:30:00'),
(2, 129.90, '2025-10-14 10:15:00');

-- PAGAMENTO_HAS_FORMA_PAGAMENTO
INSERT INTO PAGAMENTO_HAS_FORMA_PAGAMENTO (id_pagamento, id_forma_pagamento, valor_pago) VALUES
(1, 1, 209.70),  -- Pagamento 1 com Cartão de Crédito
(2, 2, 129.90);  -- Pagamento 2 com Boleto Bancário
