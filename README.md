# LinguaFlash 🌎✨

Uma aplicação web moderna e interativa para aprendizado de idiomas através de associação visual e exercícios práticos.

## 🚀 Características

- Sistema de autenticação completo (registro e login)
- Interface intuitiva e amigável
- Sistema de cadastro de palavras com imagens
- Modo prática com quiz interativo
- Sistema de pontuação e feedback imediato
- Contagem de acertos e erros
- Proteção de rotas com authentication guards
- Containerização com Docker

## 🛠️ Tecnologias Utilizadas

- Frontend:
  - Vue.js 3
  - Vue Router
  - TypeScript
  - Axios
  - CSS3
  - Composables para gerenciamento de estado

- Backend:
  - Node.js
  - Express
  - MySQL
  - Multer (para upload de arquivos)
  - JWT (JSON Web Tokens para autenticação)
  - Bcrypt (para hash de senhas)

- Infraestrutura:
  - Docker
  - Docker Compose

## 📋 Pré-requisitos

- Docker
- Docker Compose

## 🔧 Instalação e Execução

1. Clone o repositório:
   ```bash
   git clone [url-do-repositorio]
   cd ingles
   ```

2. Configure as variáveis de ambiente:
   ```bash
   # Na raiz do projeto
   cp .env.example .env
   # Configure as variáveis no arquivo .env conforme necessário
   ```

3. Inicie os containers:
   ```bash
   docker-compose up --build
   ```

4. Acesse a aplicação:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

> **Nota**: A pasta `/backend/uploads` é usada para armazenar as imagens enviadas pelos usuários. Esta pasta é ignorada pelo Git (exceto o arquivo .gitkeep), então será necessário criar a pasta localmente após clonar o repositório.

## 📦 Estrutura do Projeto

```
.
├── backend/
│   ├── uploads/        # Armazena as imagens enviadas (ignorado pelo Git)
│   ├── Dockerfile      # Configuração do container do backend
│   ├── init.sql       # Schema do banco de dados
│   ├── package.json   
│   └── server.js      # Servidor Express
├── .env.example       # Modelo para configuração das variáveis de ambiente
├── .env              # Configurações locais (ignorado pelo Git)
├── src/
│   ├── assets/        # Arquivos estáticos (CSS, imagens)
│   ├── router/        # Configuração das rotas
│   ├── views/         # Componentes de página
│   ├── App.vue        # Componente raiz
│   └── main.ts        # Ponto de entrada da aplicação
├── docker-compose.yml  # Configuração dos serviços
├── Dockerfile         # Configuração do container do frontend
└── package.json
```

## 🔄 Fluxo da Aplicação

1. **Autenticação**
   - **Registro**
     - Formulário de registro com validação
     - Campos: nome, email, senha
     - Hash seguro da senha
     - Geração de token JWT
   
   - **Login**
     - Formulário de login
     - Validação de credenciais
     - Geração de token JWT
     - Redirecionamento automático

2. **Menu Principal** (requer autenticação)
   - Opções disponíveis: Palavras, Frases*, Diálogos*
   - (*) Funcionalidades futuras

3. **Seção Palavras**
   - **Cadastrar Palavra**
     - Formulário para adicionar novas palavras
     - Campos: palavra em inglês, tradução, imagem
     - Upload de imagem associada
     - Vinculação automática com usuário
   
   - **Praticar**
     - Quiz interativo com imagens
     - Palavra em inglês exibida
     - 4 opções de imagens para escolha
     - Feedback visual imediato
     - Contagem de acertos e erros
     - Resultados finais ao encerrar
     - Acesso apenas às palavras do usuário

## 📚 Banco de Dados

### Tabela: users
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(255)) - Nome do usuário
- `email` (VARCHAR(255), UNIQUE) - Email do usuário
- `password` (VARCHAR(255)) - Hash da senha
- `created_at` (TIMESTAMP) - Data de criação

### Tabela: words
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `word` (VARCHAR(255)) - Palavra em inglês
- `translation` (VARCHAR(255)) - Tradução em português
- `image_url` (VARCHAR(255)) - Caminho da imagem
- `user_id` (INT, FOREIGN KEY) - ID do usuário que cadastrou
- `created_at` (TIMESTAMP) - Data de criação

## 🔒 Autenticação e Segurança

- JWT (JSON Web Tokens) para gerenciamento de sessão
- Proteção de rotas no frontend e backend
- Hash de senhas com bcrypt
- Middleware de autenticação para proteção de rotas da API
- Verificação automática de token expirado
- Redirecionamento automático para login quando necessário
- Associação automática de palavras ao usuário atual

## 🔐 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registro de novo usuário
  - Body: `{ name, email, password }`
  - Retorna: `{ token, user }`

- `POST /api/auth/login` - Login de usuário
  - Body: `{ email, password }`
  - Retorna: `{ token, user }`

- `GET /api/auth/me` - Informações do usuário atual
  - Header: `Authorization: Bearer <token>`
  - Retorna: `{ user }`

### Palavras
- `POST /api/words` - Cadastro de palavra (autenticado)
  - Header: `Authorization: Bearer <token>`
  - Body: FormData com `word`, `translation`, `image`
  - Retorna: `{ id, word, translation, image_url }`

- `GET /api/words` - Lista de palavras do usuário (autenticado)
  - Header: `Authorization: Bearer <token>`
  - Retorna: `[{ id, word, translation, image_url }]`
- `translation` (VARCHAR(255)) - Tradução em português
- `image_url` (VARCHAR(255)) - Caminho da imagem
- `created_at` (TIMESTAMP) - Data de criação

## 🔌 API Endpoints

### GET /api/words
- Retorna todas as palavras cadastradas
- Resposta: Array de objetos word

### POST /api/words
- Cadastra uma nova palavra
- Aceita multipart/form-data
- Parâmetros:
  - word: string
  - translation: string
  - image: file
- Resposta: Objeto word criado

## ⚙️ Configurações do Projeto

### Variáveis de Ambiente
O projeto utiliza variáveis de ambiente para configuração. Um arquivo `.env.example` é fornecido como modelo:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=linguaflash
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h

# File Upload Configuration
UPLOAD_DIR=./backend/uploads
MAX_FILE_SIZE=5242880 # 5MB
```

> **Importante**: O arquivo `.env` contendo as configurações reais não deve ser commitado no Git.

### Arquivos e Diretórios Ignorados
Os seguintes arquivos e diretórios são ignorados pelo Git por questões de segurança e boas práticas:
- `.env` e outros arquivos de ambiente (exceto `.env.example`)
- `/backend/uploads/*` (exceto `.gitkeep`)
- Arquivos de log e temporários
- Arquivos de build e dependências

### Configuração do Docker

O projeto utiliza três containers:
1. **Frontend (app)**
   - Porta: 5173
   - Node.js com Vite

2. **Backend (api)**
   - Porta: 3000
   - Node.js com Express

3. **Banco de Dados (db)**
   - Porta: 3306
   - MySQL 8.0

## 🤝 Como Contribuir

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Notas

- É necessário cadastrar pelo menos 4 palavras antes de iniciar o modo prática
- As imagens enviadas são armazenadas no diretório `/backend/uploads`
- O sistema mantém a contagem de acertos/erros durante a sessão de prática

## 🔜 Funcionalidades Futuras

- Seção de Frases
- Seção de Diálogos
- Sistema de níveis de dificuldade
- Histórico de práticas
- Estatísticas de aprendizado
- Modo de revisão espaçada

## 🌟 Novidade: Busca de Imagens no Pixabay

Agora você pode buscar imagens diretamente na internet para associar às palavras cadastradas! Basta clicar no botão "Buscar na Internet" na tela de cadastro de palavras, escolher uma imagem do Pixabay e ela será automaticamente anexada ao formulário.
