-- ========================
-- SET SCHEMA
-- ========================
SET search_path TO public;

-- ========================
-- DROP EM ORDEM DE DEPENDÊNCIA
-- ========================
DROP TABLE IF EXISTS PAGAMENTO_HAS_FORMA_PAGAMENTO CASCADE;
DROP TABLE IF EXISTS PAGAMENTO CASCADE;
DROP TABLE IF EXISTS PEDIDO_HAS_PRODUTO CASCADE;
DROP TABLE IF EXISTS PEDIDO CASCADE;
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
-- CRIAÇÃO DAS TABELAS
-- ========================

CREATE TABLE PESSOA (
    cpf_pessoa VARCHAR(20) PRIMARY KEY,
    nome_pessoa VARCHAR(60) NOT NULL,
    data_nascimento_pessoa DATE,
    endereco_pessoa VARCHAR(150),
    senha_pessoa VARCHAR(50) NOT NULL,
    email_pessoa VARCHAR(75) UNIQUE NOT NULL
);

CREATE TABLE CLIENTE (
    pessoa_cpf_pessoa VARCHAR(20) PRIMARY KEY,
    renda_cliente FLOAT8,
    data_cadastro_cliente DATE,
    FOREIGN KEY (pessoa_cpf_pessoa) REFERENCES PESSOA(cpf_pessoa) ON DELETE CASCADE
);

CREATE TABLE CARGO (
    id_cargo SERIAL PRIMARY KEY,
    nome_cargo VARCHAR(45) NOT NULL
);

CREATE TABLE FUNCIONARIO (
    pessoa_cpf_pessoa VARCHAR(20) PRIMARY KEY,
    salario_funcionario FLOAT8,
    cargo_id_cargo INT,
    porcentagem_comissao_funcionario FLOAT8,
    FOREIGN KEY (pessoa_cpf_pessoa) REFERENCES PESSOA(cpf_pessoa) ON DELETE CASCADE,
    FOREIGN KEY (cargo_id_cargo) REFERENCES CARGO(id_cargo) ON DELETE SET NULL
);

CREATE TABLE GERENTE (
    id_pessoa VARCHAR(20) PRIMARY KEY,
    FOREIGN KEY (id_pessoa) REFERENCES FUNCIONARIO(pessoa_cpf_pessoa) ON DELETE CASCADE
);

CREATE TABLE PRODUTO (
    id_produto SERIAL PRIMARY KEY,
    nome_produto VARCHAR(100) NOT NULL,
    quantidade_estoque_produto INT NOT NULL CHECK (quantidade_estoque_produto >= 0),
    preco_unitario_produto FLOAT8 NOT NULL CHECK (preco_unitario_produto >= 0)
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

CREATE TABLE PEDIDO (
    id_pedido SERIAL PRIMARY KEY,
    cliente_pessoa_cpf_pessoa VARCHAR(20) NOT NULL,
    funcionario_pessoa_cpf_pessoa VARCHAR(20) NOT NULL,
    data_pedido DATE,
    FOREIGN KEY (cliente_pessoa_cpf_pessoa) REFERENCES PESSOA(cpf_pessoa) ON DELETE CASCADE,
    FOREIGN KEY (funcionario_pessoa_cpf_pessoa) REFERENCES FUNCIONARIO(pessoa_cpf_pessoa) ON DELETE CASCADE
);

CREATE TABLE PEDIDO_HAS_PRODUTO (
    produto_id_produto INT NOT NULL,
    pedido_id_pedido INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario FLOAT8 NOT NULL CHECK (preco_unitario >= 0),
    PRIMARY KEY (produto_id_produto, pedido_id_pedido),
    FOREIGN KEY (produto_id_produto) REFERENCES PRODUTO(id_produto) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id_pedido) REFERENCES PEDIDO(id_pedido) ON DELETE CASCADE
);

CREATE TABLE FORMA_PAGAMENTO (
    id_forma_pagamento SERIAL PRIMARY KEY,
    nome_forma_pagamento VARCHAR(100) NOT NULL
);

CREATE TABLE PAGAMENTO (
    pedido_id_pedido INT PRIMARY KEY,
    data_pagamento TIMESTAMP NOT NULL,
    valor_total_pagamento FLOAT8 NOT NULL CHECK (valor_total_pagamento >= 0),
    FOREIGN KEY (pedido_id_pedido) REFERENCES PEDIDO(id_pedido) ON DELETE CASCADE
);

CREATE TABLE PAGAMENTO_HAS_FORMA_PAGAMENTO (
    pagamento_id_pedido INT NOT NULL,
    forma_pagamento_id_forma_pagamento INT NOT NULL,
    valor_pago FLOAT8 NOT NULL CHECK (valor_pago >= 0),
    PRIMARY KEY (pagamento_id_pedido, forma_pagamento_id_forma_pagamento),
    FOREIGN KEY (pagamento_id_pedido) REFERENCES PAGAMENTO(pedido_id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (forma_pagamento_id_forma_pagamento) REFERENCES FORMA_PAGAMENTO(id_forma_pagamento) ON DELETE CASCADE
);

-- ========================
-- DADOS DE EXEMPLO
-- ========================

-- PESSOAS
INSERT INTO PESSOA (cpf_pessoa, nome_pessoa, data_nascimento_pessoa, endereco_pessoa, senha_pessoa, email_pessoa) VALUES
('1', 'João Silva', '1985-05-10', 'Rua A, 10', 'senha123', 'joao@empresa.com'),
('2', 'Maria Santos', '1990-07-15', 'Rua B, 20', 'senha456', 'maria@empresa.com'),
('3', 'Carlos Lima', '1988-03-22', 'Rua C, 30', 'senha789', 'carlos@empresa.com'),
('4', 'Ana Pereira', '1992-02-20', 'Rua D, 40', 'senha111', 'ana@cliente.com'),
('5', 'Bruno Costa', '1987-11-05', 'Rua E, 50', 'senha222', 'bruno@cliente.com'),
('6', 'Carla Rocha', '1995-08-30', 'Rua F, 60', 'senha333', 'carla@cliente.com'),
('7', 'Fabio Souza', '1983-01-05', 'Rua G, 70', 'senha321', 'fabio@empresa.com'),
('8', 'Gabriela Alves', '1991-09-10', 'Rua H, 80', 'senha654', 'gabriela@empresa.com'),
('9', 'Helena Martins', '1987-12-20', 'Rua I, 90', 'senha987', 'helena@empresa.com'),
('10','Igor Campos', '1986-06-25', 'Rua J, 100','senha159','igor@empresa.com');

-- CLIENTES
INSERT INTO CLIENTE (pessoa_cpf_pessoa, renda_cliente, data_cadastro_cliente) VALUES
('4', 5000.00, '2025-10-10'),
('5', 7000.00, '2025-10-11'),
('6', 3000.00, '2025-10-12');

-- CARGOS
INSERT INTO CARGO (nome_cargo) VALUES
('GERENTE'), ('FUNCIONARIO');

-- FUNCIONARIOS
INSERT INTO FUNCIONARIO (pessoa_cpf_pessoa, salario_funcionario, cargo_id_cargo, porcentagem_comissao_funcionario) VALUES
('1', 3000.00, 1, 5.0),
('2', 4000.00, 2, 6.0),
('3', 2500.00, 1, 4.5),
('7', 3500.00, 2, 7.0),
('8', 3200.00, 1, 5.5),
('9', 3100.00, 1, 5.0),
('10',3600.00, 2, 6.5);

-- GERENTES
INSERT INTO GERENTE (id_pessoa) VALUES ('2'), ('7');

-- PRODUTOS
-- PRODUTOS
INSERT INTO PRODUTO (id_produto, nome_produto, quantidade_estoque_produto, preco_unitario_produto) VALUES
(1,  'Camiseta Rock', 100, 79.90),
(2,  'Vinil - Metallica - Master of Puppets', 50, 129.90),
(3,  'CD - Angra - Rebirth', 60, 49.90),
(4,  'Vinil - Yes - Fragile', 30, 149.90),
(5,  'Vinil - King Crimson - In the Court of the Crimson King', 40, 159.90),
(6,  'Vinil - Pink Floyd - Wish You Were Here', 35, 169.90),
(7,  'CD - Megadeth - Rust in Peace', 45, 59.90),
(8,  'CD - Iron Maiden - The Number of the Beast', 70, 54.90),
(9,  'Vinil - Black Sabbath - Paranoid', 55, 139.90),
(10, 'CD - Dream Theater - Metropolis Pt. 2: Scenes from a Memory', 33, 64.90),
(11, 'Vinil - Rush - Moving Pictures', 25, 144.90),
(12, 'CD - Judas Priest - Painkiller', 60, 52.90),
(13, 'Vinil - Deep Purple - Machine Head', 20, 134.90),
(14, 'CD - Opeth - Blackwater Park', 22, 58.90);

-- CAMISETA
INSERT INTO CAMISETA (id_produto, tamanho, cor) VALUES
(1, 'M', 'preto');

-- VINIL
INSERT INTO VINIL (id_produto, ano_lancamento) VALUES
(2, 1986),   -- Metallica
(4, 1971),   -- Yes
(5, 1969),   -- King Crimson
(6, 1975),   -- Pink Floyd
(9, 1970),   -- Black Sabbath
(11, 1981),  -- Rush
(13, 1972);  -- Deep Purple

-- CD
INSERT INTO CD (id_produto, duracao_minutos) VALUES
(3, 75),    -- Angra
(7, 40),    -- Megadeth
(8, 44),    -- Iron Maiden
(10, 77),   -- Dream Theater
(12, 46),   -- Judas Priest
(14, 67);   -- Opeth

-- PEDIDOS
INSERT INTO PEDIDO (funcionario_pessoa_cpf_pessoa, data_pedido, cliente_pessoa_cpf_pessoa) VALUES
('1', '2025-10-13', '4'),
('2', '2025-10-14', '5');

-- ITENS DO PEDIDO
INSERT INTO PEDIDO_HAS_PRODUTO (pedido_id_pedido, produto_id_produto, quantidade, preco_unitario) VALUES
(1, 1, 2, 79.90),
(1, 3, 1, 49.90),
(2, 2, 1, 129.90);

-- PAGAMENTO
INSERT INTO PAGAMENTO (pedido_id_pedido, data_pagamento, valor_total_pagamento) VALUES
(1, '2025-10-13 14:30:00', 209.70),
(2, '2025-10-14 10:15:00', 129.90);

-- FORMAS DE PAGAMENTO
INSERT INTO FORMA_PAGAMENTO (nome_forma_pagamento) VALUES
('Cartão de Crédito'),
('Boleto Bancário'),
('Pix'),
('Dinheiro');

-- RELAÇÃO ENTRE PAGAMENTO E FORMA_PAGAMENTO
INSERT INTO PAGAMENTO_HAS_FORMA_PAGAMENTO (pagamento_id_pedido, forma_pagamento_id_forma_pagamento, valor_pago) VALUES
(1, 1, 209.70),
(2, 2, 129.90);
