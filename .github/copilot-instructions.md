# Guia de Desenvolvimento LinguaFlash para IA

Este guia ajuda os agentes de IA a entenderem e trabalharem efetivamente com a aplicação de aprendizado de idiomas LinguaFlash.

## Arquitetura do Projeto

### Frontend (Vue 3 + TypeScript)
- `src/views/`: Componentes de página para autenticação, gerenciamento de palavras e prática
- `src/composables/`: Lógica compartilhada (ex: `useAuth.ts` para autenticação)
- `src/api/`: Configuração do cliente Axios
- `src/router/`: Definições de rotas com guardas de autenticação
- `src/components/`: Componentes reutilizáveis
- `src/config/`: Configuração baseada em ambiente

### Backend (Node.js + Express)
- `backend/server.js`: Aplicação principal Express
- `backend/routes/`: Manipuladores de rotas da API
- `backend/auth/`: Middleware e rotas de autenticação
- `backend/uploads/`: Diretório de armazenamento de imagens

## Padrões Principais de Desenvolvimento

### Fluxo de Autenticação
```typescript
// Autenticação frontend com JWT
const auth = useAuth();
// Exemplo de guarda de rota protegida
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) next('/login');
  else next();
});
```

### Gerenciamento de Estado
- Usa Vue 3 Composition API com composables
- Estado global de autenticação em `useAuth.ts`
- Estado local de componentes com `ref` e `reactive`

### Integração com API
- Instância Axios centralizada em `src/api/axios.ts`
- Injeção automática de token:
```typescript
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Padrão de Upload de Arquivos
- Imagens armazenadas em `backend/uploads/`
- Usando middleware `multer` para tratamento de multipart/form-data
- Exemplo de uso em `RegisterWordView.vue`

### Tratamento de Erros
- Erros do backend retornam respostas estruturadas:
```typescript
catch (error) {
  res.status(500).json({ 
    error: 'Mensagem de erro',
    details: error?.message 
  });
}
```

## Fluxo de Desenvolvimento

1. **Configuração do Ambiente**
   ```bash
   # Iniciar todos os serviços
   docker-compose up --build
   ```

2. **Inicialização do Banco de Dados**
   - Schema criado automaticamente a partir de `backend/init.sql`
   - Requer mínimo de 4 palavras para o modo prática

3. **Tarefas Comuns**
   - Adicionando novas rotas: Atualizar `router/index.ts` e proteger com `meta: { requiresAuth: true }`
   - Adicionando endpoints da API: Criar manipulador de rota em `backend/routes/` e proteger com `authMiddleware`
   - Tratamento de upload de imagens: Usar middleware `multer` e armazenar em `uploads/` directory

## Definições de Tipos

### Interfaces Principais
```typescript
interface Word {
  id: number;
  word: string;
  translation: string;
  image_url: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}
```

## Diretrizes de Desenvolvimento

1. **Autenticação**
   - Sempre proteger rotas com `meta: { requiresAuth: true }`
   - Usar composable `useAuth` para operações de autenticação
   - Tratar respostas 401 com redirecionamento para login

2. **Manipulação de Imagens**
   - Armazenar uploads em `backend/uploads/`
   - Usar helper `getImageUrl` para construção de URLs
   - Validar tipos e tamanhos de arquivos

3. **Tratamento de Erros**
   - Capturar e estruturar erros da API
   - Mostrar mensagens amigáveis ao usuário
   - Registrar detalhes técnicos para depuração

4. **Gerenciamento de Estado**
   - Usar Vue 3 Composition API
   - Manter estado de autenticação em `useAuth`
   - Estado dos componentes com `ref`/`reactive`

## Áreas de Foco para Testes

- Fluxos de autenticação
- Funcionalidade de upload de imagens
- Seleção de palavras no modo prática
- Cálculo de pontuação
- Cenários de erro da API