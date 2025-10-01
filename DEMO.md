# 🎯 Como Testar o RAGBot UnB

## Interface Completa Implementada ✅

O projeto está 100% funcional! Aqui estão as funcionalidades disponíveis:

### 🌟 Funcionalidades Principais

1. **Header Completo**
   - Logo "RAGBot UnB" à esquerda
   - Toggle de tema claro/escuro (persistente)
   - Botão GitHub (configurável via .env)
   - Relógio local atualizado a cada 30 segundos

2. **Interface de Chat**
   - Mensagem de boas-vindas centralizada
   - 4 perguntas de exemplo clicáveis
   - Chat com balões do usuário e assistente
   - Suporte completo a Markdown nas respostas
   - Indicador de "digitando..." durante as requisições

3. **Input Inteligente**
   - Textarea responsiva (1-6 linhas)
   - Enter para enviar, Shift+Enter para nova linha
   - Botão com loading state
   - Validação (não envia se vazio)
   - Auto-resize conforme o texto

4. **Estados e Tratamento de Erros**
   - Loading states visuais
   - Tratamento de erros com retry
   - Scroll automático para novas mensagens
   - Feedback visual em todas as ações

### 🎨 Design e UX

- **Responsivo**: Funciona perfeitamente de mobile (360px) até desktop
- **Acessível**: ARIA labels, navegação por teclado, contraste adequado
- **Moderno**: Animações suaves, tipografia Inter, espaçamentos harmoniosos
- **Temas**: Suporte nativo a modo claro/escuro

### 🔧 Como Testar

1. **Inicie o servidor**:
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Acesse**: http://localhost:5173

3. **Teste as funcionalidades**:
   - Clique no toggle de tema (canto superior direito)
   - Digite uma pergunta ou clique nos exemplos
   - Observe as animações e estados de loading
   - Teste a responsividade redimensionando a janela

### 🚀 Mock Service

O projeto inclui um serviço mock que simula o backend:
- Respostas variadas e realistas
- Delay simulado (1.5-2.5s)
- Suporte a Markdown nas respostas
- Tratamento de erros

### 📱 Teste Mobile

1. Abra o DevTools (F12)
2. Ative o modo mobile (Ctrl+Shift+M)
3. Teste diferentes tamanhos de tela
4. Verifique se tudo está responsivo

### 🔗 Integração com Backend

Para conectar com a API real, configure:

\`\`\`.env
VITE_API_BASE_URL=http://localhost:8000
\`\`\`

A API deve implementar:
- **POST /ask**
- Body: \`{ "question": "string" }\`
- Response: \`{ "answer": "string" }\`

---

**Tudo pronto para uso! 🎉**