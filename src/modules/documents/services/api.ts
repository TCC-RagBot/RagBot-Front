import type { 
  Document, 
  DocumentsResponse,
  ApiDocumentsResponse,
  DocumentFilters, 
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
    // Use mock data if no API URL is configured or if it's the default localhost
    if (!import.meta.env.VITE_API_BASE_URL || 
        import.meta.env.VITE_API_BASE_URL === 'http://localhost:8000' ||
        import.meta.env.DEV) {
      return this.getMockDocuments(params)
    }

    try {
      const searchParams = new URLSearchParams()
      searchParams.append('page', params.page.toString())
      searchParams.append('limit', params.pageSize.toString())
      
      if (params.filters?.search) {
        searchParams.append('search', params.filters.search)
      }

      const response = await fetch(`${this.baseUrl}/documents?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const apiData: ApiDocumentsResponse = await response.json()
      
      // Converter dados da API para o formato interno
      const convertedDocuments = apiData.documents.map(doc => this.convertApiDocument(doc))
      
      // Aplicar filtros localmente (já que a API pode não suportar todos)
      let filteredDocuments = this.applyLocalFilters(convertedDocuments, params.filters)
      
      // Aplicar ordenação local
      if (params.sortBy) {
        filteredDocuments = this.applySorting(filteredDocuments, params.sortBy, params.sortOrder)
      }
      
      // Aplicar paginação local
      const total = apiData.total_documents
      const totalPages = Math.ceil(total / params.pageSize)
      
      return {
        documents: filteredDocuments,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        success: true
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error)
      
      return {
        documents: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  async deleteDocument(documentId: string): Promise<{ success: boolean; error?: string }> {
    // Use mock deletion in development
    if (!import.meta.env.VITE_API_BASE_URL || 
        import.meta.env.VITE_API_BASE_URL === 'http://localhost:8000' ||
        import.meta.env.DEV) {
      return this.mockDeleteDocument(documentId)
    }

    try {
      const response = await fetch(`${this.baseUrl}/delete_docs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ document_id: documentId }),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      return { success: true }
    } catch (error) {
      console.error('Erro ao excluir documento:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao excluir documento'
      }
    }
  }

  private async mockDeleteDocument(documentId: string): Promise<{ success: boolean; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500))
    
    // Remove document from mock array
    const initialLength = this.mockDocuments.length
    this.mockDocuments = this.mockDocuments.filter(doc => doc.id !== documentId)
    
    if (this.mockDocuments.length < initialLength) {
      return { success: true }
    } else {
      return { 
        success: false, 
        error: 'Documento não encontrado' 
      }
    }
  }

  /**
   * Converte dados da API para o formato interno da aplicação
   */
  private convertApiDocument(apiDoc: ApiDocumentsResponse['documents'][0]): Document {
    // Extrai informações do filename
    const fileInfo = this.extractFileInfo(apiDoc.filename)
    
    return {
      id: apiDoc.id,
      filename: apiDoc.filename,
      file_size_kb: apiDoc.file_size_kb,
      uploaded_at: apiDoc.uploaded_at,
      // Campos derivados para compatibilidade
      title: fileInfo.title,
      type: fileInfo.type,
      category: fileInfo.category,
      date: apiDoc.uploaded_at.split('T')[0], // Usa upload date como data do documento
      council: fileInfo.council,
      summary: `Documento ${fileInfo.type} do ${fileInfo.council}`,
      url: `${this.baseUrl}/documents/${apiDoc.id}/download`,
      pageCount: Math.ceil(apiDoc.file_size_kb / 50), // Estimativa baseada no tamanho
      fileSize: `${(apiDoc.file_size_kb / 1024).toFixed(1)} MB`,
      status: 'active' as DocumentStatus,
      createdAt: apiDoc.uploaded_at,
      updatedAt: apiDoc.uploaded_at
    }
  }

  /**
   * Extrai informações do nome do arquivo
   */
  private extractFileInfo(filename: string): {
    title: string
    type: DocumentType
    category: DocumentCategory
    council: string
  } {
    const name = filename.toLowerCase()
    
    // Determina tipo baseado no nome do arquivo
    let type: DocumentType = 'ata'
    if (name.includes('resolucao') || name.includes('resolution')) type = 'resolucao'
    else if (name.includes('portaria')) type = 'portaria'
    else if (name.includes('edital')) type = 'edital'
    else if (name.includes('regulamento')) type = 'regulamento'
    else if (name.includes('norma')) type = 'norma'
    
    // Determina categoria baseado no nome do arquivo
    let category: DocumentCategory = 'outros'
    let council = 'Documento da UnB'
    
    if (name.includes('conselho') && name.includes('universitario')) {
      category = 'conselho-universitario'
      council = 'Conselho Universitário'
    } else if (name.includes('cepe') || name.includes('ensino')) {
      category = 'conselho-ensino-pesquisa-extensao'
      council = 'Conselho de Ensino, Pesquisa e Extensão'
    } else if (name.includes('cad') || name.includes('administracao')) {
      category = 'conselho-administracao'
      council = 'Conselho de Administração'
    } else if (name.includes('colegiado')) {
      category = 'colegiado-curso'
      council = 'Colegiado de Curso'
    } else if (name.includes('congregacao')) {
      category = 'congregacao'
      council = 'Congregação'
    }
    
    return {
      title: filename.replace(/\.[^/.]+$/, ''), // Remove extensão
      type,
      category,
      council
    }
  }

  /**
   * Aplica filtros localmente nos dados
   */
  private applyLocalFilters(documents: Document[], filters?: DocumentFilters): Document[] {
    if (!filters) return documents

    let filtered = [...documents]

    if (filters.type) {
      filtered = filtered.filter(doc => doc.type === filters.type)
    }

    if (filters.category) {
      filtered = filtered.filter(doc => doc.category === filters.category)
    }

    if (filters.status) {
      filtered = filtered.filter(doc => doc.status === filters.status)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(doc =>
        (doc.title?.toLowerCase().includes(searchLower)) ||
        (doc.filename?.toLowerCase().includes(searchLower)) ||
        (doc.summary?.toLowerCase().includes(searchLower)) ||
        (doc.council?.toLowerCase().includes(searchLower))
      )
    }

    return filtered
  }

  /**
   * Aplica ordenação nos dados
   */
  private applySorting(documents: Document[], sortBy: keyof Document, sortOrder: 'asc' | 'desc' = 'desc'): Document[] {
    return documents.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      const order = sortOrder === 'asc' ? 1 : -1
      
      if (aValue && bValue) {
        if (aValue < bValue) return -1 * order
        if (aValue > bValue) return 1 * order
      }
      return 0
    })
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
          doc.date && new Date(doc.date) >= new Date(dateFrom)
        )
      }

      if (dateTo) {
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.date && new Date(doc.date) <= new Date(dateTo)
        )
      }

      if (search) {
        const searchLower = search.toLowerCase()
        filteredDocuments = filteredDocuments.filter(doc =>
          (doc.title?.toLowerCase().includes(searchLower)) ||
          (doc.summary?.toLowerCase().includes(searchLower)) ||
          (doc.council?.toLowerCase().includes(searchLower)) ||
          (doc.filename?.toLowerCase().includes(searchLower))
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

      const filename = `${template.title.replace('{session}', (Math.floor(Math.random() * 20) + 1).toString()).replace('{council}', council)}.pdf`
      const fileSizeKb = Math.floor(Math.random() * 5000) + 500 // 500KB a 5MB
      
      documents.push({
        id: `doc-${i.toString().padStart(3, '0')}`,
        filename,
        file_size_kb: fileSizeKb,
        uploaded_at: createdAt.toISOString(),
        // Campos derivados
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
        fileSize: `${(fileSizeKb / 1024).toFixed(1)} MB`,
        status,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString()
      })
    }

    // Sort by uploaded_at descending
    return documents.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
  }
}

export default new DocumentsApiService()