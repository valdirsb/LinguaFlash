# LinguaFlash 🌎✨

Uma aplicação web moderna e interativa para aprendizado de idiomas através de associação visual e exercícios práticos.

## 🚀 Características

- Interface intuitiva e amigável
- Sistema de cadastro de palavras com imagens
- Modo prática com quiz interativo
- Sistema de pontuação e feedback imediato
- Contagem de acertos e erros
- Containerização com Docker

## 🛠️ Tecnologias Utilizadas

- Frontend:
  - Vue.js 3
  - Vue Router
  - TypeScript
  - Axios
  - CSS3

- Backend:
  - Node.js
  - Express
  - MySQL
  - Multer (para upload de arquivos)

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

2. Inicie os containers:
   ```bash
   docker-compose up --build
   ```

3. Acesse a aplicação:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📦 Estrutura do Projeto

```
.
├── backend/
│   ├── uploads/        # Armazena as imagens enviadas
│   ├── Dockerfile      # Configuração do container do backend
│   ├── init.sql       # Schema do banco de dados
│   ├── package.json   
│   └── server.js      # Servidor Express
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

1. **Menu Principal**
   - Opções disponíveis: Palavras, Frases*, Diálogos*
   - (*) Funcionalidades futuras

2. **Seção Palavras**
   - **Cadastrar Palavra**
     - Formulário para adicionar novas palavras
     - Campos: palavra em inglês, tradução, imagem
     - Upload de imagem associada
   
   - **Praticar**
     - Quiz interativo com imagens
     - Palavra em inglês exibida
     - 4 opções de imagens para escolha
     - Feedback visual imediato
     - Contagem de acertos e erros
     - Resultados finais ao encerrar

## 📚 Banco de Dados

### Tabela: words
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `word` (VARCHAR(255)) - Palavra em inglês
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

## ⚙️ Configuração do Docker

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
