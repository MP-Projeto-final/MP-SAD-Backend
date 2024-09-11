Aqui está o arquivo `README.md` em markdown, explicando como configurar e rodar o projeto:

```markdown
# Projeto de Doações - Backend

Este projeto é uma API de gerenciamento de doações, utilizando Node.js, Sequelize, PostgreSQL (ou SQLite para testes), e integrações com um banco de dados.

## Tecnologias utilizadas

- **Node.js**
- **Express**
- **Sequelize** (ORM)
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
git clone https://github.com/seu-usuario/projeto-doacoes.git
cd projeto-doacoes
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
PORT=3000
```

Certifique-se de que você tem um banco de dados PostgreSQL rodando e configurado conforme as variáveis acima.

### 4. Rodar as migrações e criar o banco de dados

Para aplicar as migrações e sincronizar o banco de dados:

```bash
npm run db:migrate
```

### 5. Executar o servidor

Agora, você pode iniciar o servidor da API:

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`.

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
npm test
```

Isso irá rodar os testes utilizando **Mocha** e **Chai** e criar um banco SQLite em memória para testes temporários.

---

## Estrutura do Projeto

- `src/`: Contém o código-fonte da aplicação (rotas, controladores, modelos).
- `tests/`: Contém os arquivos de teste utilizando **Mocha/Chai**.
- `models/`: Contém as definições dos modelos de dados utilizando Sequelize.
- `controllers/`: Contém os controladores responsáveis por lidar com as requisições.
- `db.js`: Configura o banco de dados para usar PostgreSQL (desenvolvimento/produção) ou SQLite (testes).

---

## Scripts disponíveis

- `npm start`: Inicia o servidor de desenvolvimento.
- `npm test`: Executa os testes utilizando Mocha/Chai.
- `npm run db:migrate`: Aplica as migrações no banco de dados.

---

## Contribuindo

Sinta-se à vontade para abrir issues ou pull requests para melhorias e correções no código!

---

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
```

### Instruções principais:
- **Instalar as dependências**.
- **Configurar o banco de dados** no arquivo `.env`.
- **Rodar as migrações**.
- **Rodar o servidor** ou **executar os testes**. 

Essa documentação fornece os detalhes necessários para configurar e rodar o projeto corretamente, além de rodar testes em um banco de dados SQLite em memória.
