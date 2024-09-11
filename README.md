# Projeto de Doações - Backend

Este projeto é uma API de gerenciamento de doações, utilizando Node.js, Sequelize, PostgreSQL (ou SQLite para testes), e integrações com um banco de dados.

## Tecnologias utilizadas

- **Node.js**
- **Express**
- **PostgreSQL** (em produção/desenvolvimento)
- **SQLite** (para testes)
- **Mocha/Chai** (para testes unitários e de integração)

---

## Pré-requisitos

- Node.js v16.x ou superior
- NPM (gerenciador de pacotes que vem junto com o Node.js)
- PostgreSQL (apenas para o ambiente de desenvolvimento/produção)

---

## Configuração do projeto

### 1. Clone o repositório

```bash
git clone https://github.com/MP-Projeto-final/MP-SAD-Backend
cd 
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configuração do Banco de Dados

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```bash
# Configurações do banco de dados
DB_USER=seu_usuario_db
DB_PASSWORD=sua_senha_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nome_do_banco

# Ambiente de desenvolvimento
NODE_ENV=development

# Porta da aplicação
PORT=4000
```

Certifique-se de que você tem um banco de dados PostgreSQL rodando e configurado conforme as variáveis acima.

### 4. Rodar as migrações e criar o banco de dados

Ao criar o banco de dados no postgres, rode as queries contidas dentro do arquivo dump.sql.

Para aplicar a seed:

```bash
node seed.js
```

### 5. Executar o servidor

Agora, você pode iniciar o servidor da API:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:4000`.

---

## Rodando os testes

Os testes utilizam **SQLite** em memória para simular o banco de dados. Não é necessário configurar um banco PostgreSQL para rodar os testes.

### 1. Configuração para o ambiente de testes

Verifique se no arquivo `.env` você tem a variável `NODE_ENV` configurada como `test` para os testes:

```bash
NODE_ENV=test
```

### 2. Rodar os testes

Para executar os testes, basta rodar o seguinte comando:

```bash
npx mocha --exit 'tests/**/*.test.js'
```

Isso irá rodar os testes utilizando **Mocha** e **Chai** e criar um banco SQLite em memória para testes temporários.

---

## Scripts disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npx mocha --exit 'tests/**/*.test.js'`: Executa os testes utilizando Mocha/Chai.
- `node seed.js`: Aplica as migrações no banco de dados.

---

