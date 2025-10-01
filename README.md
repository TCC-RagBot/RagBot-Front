# RAGBot UnB - Interface Frontend

Uma interface de chat moderna e minimalista para o RAGBot UnB, desenvolvida em Vue 3 + Vite + Tailwind CSS. O sistema permite que usuários façam perguntas sobre as atas da Universidade de Brasília de forma anônima e intuitiva.

## 🚀 Funcionalidades

- **Interface estilo ChatGPT** - Design limpo e moderno
- **Modo claro/escuro** - Theme toggle com persistência local
- **Responsivo** - Mobile-first, funciona em qualquer dispositivo
- **Acessível** - Suporte a navegação por teclado e screen readers
- **Markdown** - Renderização de respostas com formatação rica
- **Tempo real** - Indicadores de digitação e loading states
- **Mock integrado** - Funciona sem backend para desenvolvimento

## 🛠️ Tecnologias

- **Vue 3** (Composition API)
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Styling framework
- **Marked** - Renderização de Markdown
- **Vue Router** - Roteamento SPA

## 📦 Instalação

### Pré-requisitos

- Node.js 20.19.0+ ou 22.12.0+
- npm ou yarn

### Setup do projeto

1. **Clone o repositório**
```bash
git clone https://github.com/TCC-RagBot/RagBot-Front.git
cd RagBot-Front
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:
- `VITE_API_BASE_URL`: URL da API backend (deixe vazio para usar mocks)
- `VITE_GITHUB_URL`: URL do repositório GitHub

## 🚀 Como executar

### Desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:5173

### Produção
```bash
# Build
npm run build

# Preview
npm run preview
```

### Outros comandos
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatação
npm run format

# Testes
npm run test:unit
```

## 🔧 Configuração da API

### Modo Development (Mock)
Por padrão, em desenvolvimento, o sistema usa respostas mockadas se `VITE_API_BASE_URL` não estiver definido.

### Integração com Backend
Para conectar com o backend real:

1. Configure a variável de ambiente:
```env
VITE_API_BASE_URL=http://localhost:8000
```

2. A API deve implementar o endpoint:
```
POST /ask
Content-Type: application/json

{
  "question": "sua pergunta aqui"
}
```

3. Resposta esperada:
```json
{
  "answer": "resposta do sistema"
}
```

## 🎨 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── HeaderBar.vue    # Cabeçalho com tema e navegação
│   ├── ChatBubble.vue   # Balões de conversa
│   ├── MessageInput.vue # Input de mensagem
│   └── TypingIndicator.vue # Indicador de digitação
├── services/           # Serviços e API
│   └── api.ts          # Comunicação com backend
├── views/              # Páginas/Views
│   └── ChatView.vue    # Página principal do chat
├── router/             # Configuração de rotas
└── style.css           # Estilos globais
```

## 🎯 Funcionalidades Implementadas

### Interface
- ✅ Header com logo, tema toggle, botão GitHub e relógio
- ✅ Mensagem de boas-vindas centralizada
- ✅ Chat interface com balões de usuário e assistente
- ✅ Input responsivo com suporte a multi-linha
- ✅ Indicador de "digitando..."
- ✅ Tratamento de erros com retry

### UX/UI
- ✅ Tema claro/escuro com persistência
- ✅ Animações suaves (fade, slide)
- ✅ Responsividade completa
- ✅ Acessibilidade (ARIA, keyboard navigation)
- ✅ Loading states e feedback visual

### Funcionalidades
- ✅ Envio com Enter (Shift+Enter = nova linha)
- ✅ Renderização Markdown nas respostas
- ✅ Scroll automático para novas mensagens
- ✅ Exemplos de perguntas interativas
- ✅ Mock service para desenvolvimento

## 🔮 Roadmap Futuro

- [ ] Suporte a streaming de respostas (SSE)
- [ ] Histórico de conversas (localStorage)
- [ ] Export/import de conversas
- [ ] Atalhos de teclado avançados
- [ ] PWA support
- [ ] Temas customizáveis

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🏛️ Sobre o RAGBot UnB

O RAGBot UnB é um sistema de perguntas e respostas baseado em Retrieval-Augmented Generation (RAG) que permite consultas sobre documentos oficiais da Universidade de Brasília, especialmente atas de conselhos e comissões universitárias.

---

**Desenvolvido para o TCC - Universidade de Brasília**
