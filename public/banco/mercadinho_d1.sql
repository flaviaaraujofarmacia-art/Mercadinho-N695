DROP TABLE IF EXISTS item_compra;
DROP TABLE IF EXISTS compra;
DROP TABLE IF EXISTS produto;
DROP TABLE IF EXISTS fornecedor;
DROP TABLE IF EXISTS funcionario;
DROP TABLE IF EXISTS cliente;
CREATE TABLE fornecedor (
  id_fornecedor INTEGER PRIMARY KEY AUTOINCREMENT,
  razao_social  TEXT NOT NULL,
  cnpj          TEXT NOT NULL UNIQUE,
  telefone      TEXT,
  email         TEXT
);
CREATE TABLE produto (
  codigo             INTEGER PRIMARY KEY AUTOINCREMENT,
  nome               TEXT,
  fabricante         TEXT,
  preco              REAL,
  quantidade_estoque INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_estoque >= 0),
  id_fornecedor      INTEGER REFERENCES fornecedor (id_fornecedor) ON DELETE RESTRICT,
  UNIQUE (nome, fabricante)
);
CREATE TABLE cliente (
  cpf      TEXT PRIMARY KEY,
  nome     TEXT,
  endereco TEXT,
  telefone TEXT
);
CREATE TABLE funcionario (
  id_funcionario INTEGER PRIMARY KEY AUTOINCREMENT,
  nome           TEXT,
  cargo          TEXT
);
CREATE TABLE compra (
  id_compra       INTEGER PRIMARY KEY AUTOINCREMENT,
  data            TEXT,
  forma_pagamento TEXT,
  cpf_cliente     TEXT REFERENCES cliente (cpf),
  id_funcionario  INTEGER REFERENCES funcionario (id_funcionario)
);
CREATE TABLE item_compra (
  id_item        INTEGER PRIMARY KEY AUTOINCREMENT,
  id_compra      INTEGER REFERENCES compra (id_compra),
  codigo_produto INTEGER REFERENCES produto (codigo),
  quantidade     INTEGER,
  valor_unitario REAL
);
CREATE INDEX idx_produto_fornecedor ON produto (id_fornecedor);
CREATE INDEX idx_compra_cliente ON compra (cpf_cliente);
CREATE INDEX idx_compra_funcionario ON compra (id_funcionario);
CREATE INDEX idx_item_compra ON item_compra (id_compra);
CREATE INDEX idx_item_produto ON item_compra (codigo_produto);
INSERT INTO fornecedor (id_fornecedor, razao_social, cnpj, telefone, email) VALUES
  (1, 'Distribuidora Nordeste LTDA', '11222333000181', '85999990002', 'contato@exemplo.com'),
  (2, 'Alimentos Brasil LTDA', '11444777000161', '85999990002', 'vendas@exemplo.com'),
  (3, 'Distribuidora Teste N695 Atualizada', '12345678000195', '85988887777', 'atualizado@exemplo.com'),
  (5, 'Fornecedor Teste 2 N695', '11222333000182', '85999999999', 'teste2@exemplo.com'),
  (6, 'Fornecedor Teste 4 N695', '98765432000111', '85999999999', 'teste4@exemplo.com'),
  (7, 'Fornecedor Teste CSS', '12345678000199', '85999998888', 'testecss@exemplo.com');
INSERT INTO produto (codigo, nome, fabricante, preco, quantidade_estoque, id_fornecedor) VALUES
  (5, 'arroz tipo 1', 'Tio João', 25.50, 50, 1),
  (6, 'Feijão', 'Kicaldo', 8.90, 30, 2),
  (7, 'Macarrao', 'Fortaleza', 6.50, 25, 1);
INSERT INTO cliente (cpf, nome, endereco, telefone) VALUES
  ('11111111111', 'Bruno', 'Rua C', '91777777777'),
  ('12345678900', 'Ana Silva', 'Rua A', '91999999999'),
  ('98765432100', 'Carlos Souza', 'Rua B', '91888888888');
INSERT INTO funcionario (id_funcionario, nome, cargo) VALUES
  (1, 'João', 'Caixa'),
  (2, 'Maria', 'Gerente');
INSERT INTO compra (id_compra, data, forma_pagamento, cpf_cliente, id_funcionario) VALUES
  (2, '2026-05-01', 'Cartão', '12345678900', 1),
  (3, '2026-05-01', 'Cartão', '12345678900', 1),
  (4, '2026-05-01', 'Cartão', '12345678900', 1),
  (5, '2026-05-01', 'Cartão', '12345678900', 1),
  (6, '2026-05-04', 'Cartão', '98765432100', 1),
  (17, '2026-05-04', 'Cartão', '98765432100', 1),
  (18, '2026-05-05', 'Pix', '11111111111', 2),
  (19, '2026-05-04', 'Cartão', '98765432100', 1),
  (20, '2026-05-05', 'Pix', '11111111111', 2),
  (21, '2026-05-06', 'Cartão', '12345678900', 1),
  (22, '2026-05-06', 'Pix', '98765432100', 1),
  (23, '2026-05-06', 'Dinheiro', '11111111111', 2),
  (24, '2026-05-06', 'Cartão', '12345678900', 1),
  (25, '2026-05-06', 'Pix', '98765432100', 1),
  (26, '2026-05-06', 'Dinheiro', '11111111111', 2);
INSERT INTO item_compra (id_item, id_compra, codigo_produto, quantidade, valor_unitario) VALUES
  (37, 2, 5, 2, 25.50),
  (38, 3, 6, 1, 8.90),
  (39, 4, 5, 3, 25.50),
  (40, 5, 6, 2, 8.90),
  (41, 6, 5, 1, 25.50),
  (42, 2, 5, 2, 25.50),
  (43, 3, 6, 1, 8.90),
  (44, 4, 5, 3, 25.50),
  (45, 5, 6, 2, 8.90),
  (46, 6, 5, 1, 25.50),
  (47, 2, 5, 2, 25.50),
  (48, 3, 6, 1, 8.90),
  (49, 4, 5, 3, 25.50),
  (50, 5, 6, 2, 8.90),
  (51, 6, 5, 1, 25.50);
