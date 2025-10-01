interface ChatMessage {
  question: string
}

interface ChatResponse {
  answer: string
  success: boolean
  error?: string
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  }

  async sendMessage(question: string): Promise<ChatResponse> {
    // In development, return a mock response
    if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
      return this.getMockResponse(question)
    }

    try {
      const response = await fetch(`${this.baseUrl}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question } satisfies ChatMessage),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        answer: data.answer || data.response || 'Resposta não encontrada.',
        success: true
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      return {
        answer: '',
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  private async getMockResponse(question: string): Promise<ChatResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

    const mockResponses = [
      `Obrigado por perguntar sobre "${question}". Esta é uma resposta simulada do RAGBot UnB.

**Sobre as atas da UnB:**

1. As atas contêm informações importantes sobre decisões universitárias
2. Elas são documentos oficiais que registram as discussões e deliberações
3. Você pode encontrar informações sobre:
   - Políticas acadêmicas
   - Decisões administrativas
   - Projetos e programas

Para mais informações específicas, recomendo consultar as atas mais recentes disponíveis no site oficial da universidade.

*Nota: Esta é uma resposta simulada para desenvolvimento.*`,

      `Com base na sua pergunta sobre "${question}", posso fornecer as seguintes informações das atas da UnB:

## Informações Relevantes

As atas da Universidade de Brasília contêm diversos tópicos relacionados à gestão universitária:

- **Decisões do Conselho Universitário**
- **Aprovação de novos cursos e programas**  
- **Políticas de pesquisa e extensão**
- **Questões orçamentárias e administrativas**

> *Este é um exemplo de resposta que seria gerada pelo sistema de RAG baseado nas atas oficiais da UnB.*

Para informações mais específicas, seria necessário acessar o backend real conectado à base de conhecimento.`,

      `Sua pergunta "${question}" é muito interessante! Com base nas atas da UnB, posso compartilhar que:

### Contexto Institucional

A Universidade de Brasília mantém registros detalhados de suas atividades através das atas dos diversos conselhos e comissões.

**Principais temas abordados:**
- Regulamentações acadêmicas
- Projetos de pesquisa
- Programas de extensão
- Políticas estudantis

\`\`\`
Exemplo de como as informações são estruturadas
nas atas para facilitar a consulta posterior.
\`\`\`

*Resposta gerada automaticamente pelo sistema de desenvolvimento.*`
    ]

    const randomIndex = Math.floor(Math.random() * mockResponses.length)
    return {
      answer: mockResponses[randomIndex] ?? mockResponses[0]!,
      success: true
    }
  }
}

export default new ApiService()