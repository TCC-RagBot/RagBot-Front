import type { 
  Document, 
  DocumentsResponse, 
  DocumentsPaginationParams,
  DocumentType,
  DocumentCategory,
  DocumentStatus
} from '../types'

class DocumentsApiService {
  private baseUrl: string
  private mockDocuments: Document[]

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    this.mockDocuments = this.generateMockDocuments()
  }

  async getDocuments(params: DocumentsPaginationParams): Promise<DocumentsResponse> {
    // Always use mock data for now (since backend is not ready)
    return this.getMockDocuments(params)
  }

  private async getMockDocuments(params: DocumentsPaginationParams): Promise<DocumentsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300))

    let filteredDocuments = [...this.mockDocuments]

    // Apply filters
    if (params.filters) {
      const { type, category, status, dateFrom, dateTo, search } = params.filters

      if (type) {
        filteredDocuments = filteredDocuments.filter(doc => doc.type === type)
      }

      if (category) {
        filteredDocuments = filteredDocuments.filter(doc => doc.category === category)
      }

      if (status) {
        filteredDocuments = filteredDocuments.filter(doc => doc.status === status)
      }

      if (dateFrom) {
        filteredDocuments = filteredDocuments.filter(doc => 
          new Date(doc.date) >= new Date(dateFrom)
        )
      }

      if (dateTo) {
        filteredDocuments = filteredDocuments.filter(doc => 
          new Date(doc.date) <= new Date(dateTo)
        )
      }

      if (search) {
        const searchLower = search.toLowerCase()
        filteredDocuments = filteredDocuments.filter(doc =>
          doc.title.toLowerCase().includes(searchLower) ||
          doc.summary.toLowerCase().includes(searchLower) ||
          doc.council.toLowerCase().includes(searchLower)
        )
      }
    }

    // Apply sorting
    if (params.sortBy) {
      filteredDocuments.sort((a, b) => {
        const aValue = a[params.sortBy!]
        const bValue = b[params.sortBy!]
        const order = params.sortOrder === 'asc' ? 1 : -1
        
        if (aValue && bValue) {
          if (aValue < bValue) return -1 * order
          if (aValue > bValue) return 1 * order
        }
        return 0
      })
    }

    // Apply pagination
    const total = filteredDocuments.length
    const totalPages = Math.ceil(total / params.pageSize)
    const startIndex = (params.page - 1) * params.pageSize
    const endIndex = startIndex + params.pageSize
    const documents = filteredDocuments.slice(startIndex, endIndex)

    return {
      documents,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages,
      success: true
    }
  }

  private generateMockDocuments(): Document[] {
    const categories: DocumentCategory[] = [
      'conselho-universitario',
      'conselho-ensino-pesquisa-extensao', 
      'conselho-administracao',
      'colegiado-curso',
      'congregacao',
      'outros'
    ]
    const statuses: DocumentStatus[] = ['active', 'archived', 'draft']

    const councils = [
      'Conselho Universitário',
      'Conselho de Ensino, Pesquisa e Extensão',
      'Conselho de Administração',
      'Colegiado do Curso de Ciência da Computação',
      'Colegiado do Curso de Engenharia',
      'Congregação do Instituto de Ciências Exatas',
      'Congregação da Faculdade de Medicina',
      'Comissão de Graduação'
    ]

    const documents: Document[] = []

    // Generate realistic document titles and summaries
    const documentTemplates = [
      {
        title: 'Ata da {session}ª Sessão Ordinária do {council}',
        summary: 'Discussão sobre políticas acadêmicas, aprovação de novos cursos e deliberações sobre questões administrativas da universidade.',
        type: 'ata' as DocumentType
      },
      {
        title: 'Resolução sobre Regulamento de Cursos de Graduação',
        summary: 'Estabelece normas e diretrizes para a criação, modificação e extinção de cursos de graduação na UnB.',
        type: 'resolucao' as DocumentType
      },
      {
        title: 'Portaria sobre Política de Pesquisa e Inovação',
        summary: 'Define diretrizes para fomento à pesquisa científica e programas de inovação tecnológica na universidade.',
        type: 'portaria' as DocumentType
      },
      {
        title: 'Edital de Seleção para Programas de Extensão',
        summary: 'Processo seletivo para projetos de extensão universitária com foco em impacto social e comunitário.',
        type: 'edital' as DocumentType
      },
      {
        title: 'Regulamento do Sistema de Bibliotecas',
        summary: 'Normas de funcionamento, acesso e utilização dos recursos bibliográficos da universidade.',
        type: 'regulamento' as DocumentType
      },
      {
        title: 'Norma sobre Avaliação de Desempenho Docente',
        summary: 'Critérios e procedimentos para avaliação da performance acadêmica e didática dos professores.',
        type: 'norma' as DocumentType
      }
    ]

    for (let i = 1; i <= 15; i++) {
      const template = documentTemplates[i % documentTemplates.length]!
      const council = councils[i % councils.length]!
      const category = categories[i % categories.length]!
      const status = statuses[i % statuses.length]!
      
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 365 * 2)) // Last 2 years
      
      const createdAt = new Date(date)
      createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 24))
      
      const updatedAt = new Date(createdAt)
      updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * 30))

      const dateString = date.toISOString().split('T')[0]!

      documents.push({
        id: `doc-${i.toString().padStart(3, '0')}`,
        title: template.title
          .replace('{session}', (Math.floor(Math.random() * 20) + 1).toString())
          .replace('{council}', council),
        type: template.type,
        category,
        date: dateString,
        council,
        summary: template.summary,
        url: `https://doc.unb.br/documents/doc-${i.toString().padStart(3, '0')}.pdf`,
        pageCount: Math.floor(Math.random() * 50) + 10,
        fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
        status,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString()
      })
    }

    // Sort by date descending
    return documents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}

export default new DocumentsApiService()