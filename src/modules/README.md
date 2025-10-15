# Estrutura Modular do Projeto

Este projeto está organizado em uma arquitetura modular para promover escalabilidade e manutenibilidade.

## 📁 Estrutura de Diretórios

```
src/
├── modules/                 # Módulos da aplicação
│   ├── chat/               # Módulo de chat
│   │   ├── components/     # Componentes específicos do chat
│   │   ├── views/          # Views do chat
│   │   ├── services/       # Serviços do chat (API, etc.)
│   │   ├── stores/         # Estados/stores do chat
│   │   ├── router/         # Rotas do chat
│   │   └── index.ts        # Exports do módulo
│   └── index.ts            # Exports de todos os módulos
├── shared/                 # Componentes e utilitários compartilhados
│   └── components/         # Componentes reutilizáveis
├── router/                 # Configuração principal de rotas
└── main.ts                 # Ponto de entrada da aplicação
```

## 🏗️ Arquitetura de Módulos

Cada módulo segue a seguinte estrutura:

- **components/**: Componentes Vue específicos do módulo
- **views/**: Páginas/views do módulo
- **services/**: Lógica de negócio e comunicação com APIs
- **stores/**: Gerenciamento de estado usando Pinia
- **router/**: Definição das rotas do módulo
- **index.ts**: Arquivo que exporta todos os recursos do módulo

## 🔄 Como Adicionar um Novo Módulo

1. Crie uma pasta com o nome do módulo em `src/modules/`
2. Adicione as subpastas necessárias (components, views, services, stores, router)
3. Crie o arquivo `index.ts` exportando os recursos do módulo
4. Adicione as rotas do módulo no router principal
5. Atualize o `src/modules/index.ts` para exportar o novo módulo

## 📦 Benefícios da Estrutura Modular

- **Escalabilidade**: Facilita a adição de novos recursos
- **Manutenibilidade**: Código organizado por domínio
- **Reutilização**: Componentes e serviços bem definidos
- **Separação de responsabilidades**: Cada módulo tem sua responsabilidade específica
- **Facilita testes**: Módulos podem ser testados independentemente