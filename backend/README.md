# LinguaFlash - Backend Documentation

## 📋 Visão Geral

Backend do LinguaFlash, responsável pelo gerenciamento de dados, upload de imagens e fornecimento de APIs RESTful para o frontend.

## 🛠️ Tecnologias

- **Node.js** - Ambiente de execução
- **Express** - Framework web
- **MySQL** - Banco de dados relacional
- **Multer** - Middleware para upload de arquivos
- **CORS** - Middleware para Cross-Origin Resource Sharing

## 🏗️ Estrutura do Projeto

```
backend/
├── uploads/           # Diretório para armazenamento de imagens
├── Dockerfile         # Configuração do container
├── init.sql          # Schema do banco de dados
├── package.json      # Dependências e scripts
└── server.js         # Arquivo principal do servidor
```

## 🗃️ Banco de Dados

### Tabela: words

| Campo        | Tipo          | Descrição                            |
|-------------|---------------|---------------------------------------|
| id          | INT          | Identificador único (AUTO_INCREMENT)  |
| word        | VARCHAR(255) | Palavra em inglês                     |
| translation | VARCHAR(255) | Tradução em português                 |
| image_url   | VARCHAR(255) | Caminho da imagem no servidor         |
| created_at  | TIMESTAMP    | Data de criação do registro           |

### Schema SQL
```sql
CREATE TABLE IF NOT EXISTS words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    translation VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### GET /api/words
Retorna todas as palavras cadastradas.

#### Response
```json
[
  {
    "id": 1,
    "word": "apple",
    "translation": "maçã",
    "image_url": "1758047238123.jpg",
    "created_at": "2025-09-16T10:00:00Z"
  }
]
```

#### Status Codes
- 200: Sucesso
- 500: Erro interno do servidor

### POST /api/words
Cadastra uma nova palavra com imagem.

#### Request
- Content-Type: multipart/form-data

| Campo       | Tipo   | Descrição              |
|------------|--------|------------------------|
| word       | string | Palavra em inglês      |
| translation| string | Tradução em português  |
| image      | file   | Arquivo de imagem      |

#### Response
```json
{
  "id": 1,
  "word": "apple",
  "translation": "maçã",
  "image_url": "1758047238123.jpg"
}
```

#### Status Codes
- 201: Criado com sucesso
- 400: Dados inválidos
- 500: Erro interno do servidor

## 🔒 Configurações

### Variáveis de Ambiente

| Variável      | Descrição                    | Padrão        |
|--------------|------------------------------|---------------|
| DB_HOST      | Host do banco de dados       | db            |
| DB_USER      | Usuário do banco             | root          |
| DB_PASSWORD  | Senha do banco               | password      |
| DB_NAME      | Nome do banco de dados       | english_practice |

### Configuração do Multer

```javascript
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
```

- **Destino**: Pasta 'uploads/'
- **Nomeação**: Timestamp + extensão original
- **Tipos aceitos**: Imagens (jpg, jpeg, png)
- **Limite de tamanho**: 5MB

## 🔄 Pool de Conexões MySQL

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

- **Limite de conexões**: 10
- **Fila**: Ilimitada
- **Tempo de espera**: Habilitado

## 🚀 Implantação

### Usando Docker

1. Construa a imagem:
```bash
docker build -t linguaflash-backend .
```

2. Execute o container:
```bash
docker run -p 3000:3000 linguaflash-backend
```

### Usando Docker Compose
```bash
docker-compose up --build
```

## 📁 Sistema de Arquivos

### Uploads
- Localização: `/app/uploads/` no container
- Acesso via URL: `http://localhost:3000/uploads/{filename}`
- Tipos permitidos: .jpg, .jpeg, .png
- Nomenclatura: timestamp + extensão original

### Persistência
- Volume Docker mapeado para manter arquivos após rebuild
- Backup recomendado da pasta uploads/

## 🔍 Logging e Monitoramento

### Logs do Servidor
- Requisições HTTP
- Erros de banco de dados
- Operações de upload
- Status do pool de conexões

### Mensagens de Erro
Formato padrão de resposta de erro:
```json
{
  "error": "Mensagem descritiva do erro",
  "details": {} // Detalhes adicionais quando aplicável
}
```

## 🔐 Segurança

### CORS
- Origem permitida: http://localhost:5173 (frontend)
- Métodos: GET, POST
- Headers permitidos: Content-Type, Authorization

### Upload de Arquivos
- Validação de tipo MIME
- Limite de tamanho: 5MB
- Sanitização de nomes de arquivo
- Verificação de malware (recomendado para produção)

## 🧪 Testes

### Endpoint GET /api/words
```bash
curl http://localhost:3000/api/words
```

### Endpoint POST /api/words
```bash
curl -X POST \
  -F "word=apple" \
  -F "translation=maçã" \
  -F "image=@./apple.jpg" \
  http://localhost:3000/api/words
```

## 📈 Melhorias Futuras

1. Autenticação e Autorização
   - Implementar JWT
   - Controle de acesso por usuário

2. Cache
   - Implementar Redis para cache de consultas frequentes
   - Cache de imagens

3. Otimizações
   - Compressão de imagens
   - Paginação de resultados
   - Rate limiting

4. Monitoramento
   - Implementar health checks
   - Métricas de performance
   - Log centralizado

## ⚠️ Resolução de Problemas

### Problemas Comuns

1. **Erro de conexão com o banco**
   - Verificar variáveis de ambiente
   - Confirmar status do container MySQL
   - Verificar logs do container

2. **Erro no upload de arquivos**
   - Verificar permissões da pasta uploads/
   - Confirmar limites de tamanho
   - Verificar tipos MIME permitidos

3. **CORS errors**
   - Confirmar origem correta no frontend
   - Verificar headers permitidos
   - Checar configuração CORS