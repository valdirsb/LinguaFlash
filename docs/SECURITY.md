## 🔐 Guia de Segurança

Este documento fornece informações importantes sobre a segurança da aplicação LinguaFlash.

### 🔒 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. O token é armazenado no localStorage e incluído automaticamente em todas as requisições através do interceptor do Axios.

### 🛡️ Proteção de Rotas

#### Frontend
- Rotas protegidas são marcadas com `meta: { requiresAuth: true }`
- Rotas de convidados são marcadas com `meta: { guest: true }`
- Navigation guards redirecionam usuários não autenticados para o login
- Usuários autenticados são redirecionados para home ao tentar acessar rotas de convidados

#### Backend
- Middleware de autenticação verifica a presença e validade do token JWT
- Tokens inválidos ou expirados resultam em erro 401
- Todas as rotas de dados requerem autenticação

### 🔑 Senhas

- Senhas são hasheadas com bcrypt antes de serem armazenadas
- Mínimo de 6 caracteres requerido
- Comparação segura de senhas durante o login

### 🌐 Sessões

- Tokens JWT expiram em 24 horas
- Logout limpa o token do localStorage
- Erro 401 redireciona automaticamente para o login

### 📝 Dados do Usuário

- Palavras são vinculadas ao usuário que as criou
- Usuários só podem ver e praticar com suas próprias palavras
- Upload de imagens é restrito a usuários autenticados

### ⚙️ Configuração

Variáveis de ambiente necessárias:
```env
JWT_SECRET=seu_secret_key_aqui
DB_HOST=host_do_banco
DB_USER=usuario_do_banco
DB_PASSWORD=senha_do_banco
DB_NAME=nome_do_banco
```

### 🚨 Considerações de Produção

1. Use HTTPS em produção
2. Configure um secret key forte para JWT
3. Implemente rate limiting para previnir brute force
4. Configure CORS apropriadamente
5. Implemente validação de força de senha
6. Considere adicionar autenticação de dois fatores
7. Monitore tentativas de login suspeitas