export interface Document {
  id: string
  title: string
  type: DocumentType
  category: DocumentCategory
  date: string
  council: string
  summary: string
  url?: string
  pageCount: number
  fileSize: string
  status: DocumentStatus
  createdAt: string
  updatedAt: string
}

export type DocumentType = 
  | 'ata'
  | 'resolucao'
  | 'portaria'
  | 'edital'
  | 'regulamento'
  | 'norma'

export type DocumentCategory = 
  | 'conselho-universitario'
  | 'conselho-ensino-pesquisa-extensao'
  | 'conselho-administracao'
  | 'colegiado-curso'
  | 'congregacao'
  | 'outros'

export type DocumentStatus = 
  | 'active'
  | 'archived'
  | 'draft'

export interface DocumentsResponse {
  documents: Document[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  success: boolean
  error?: string
}

export interface DocumentFilters {
  type?: DocumentType
  category?: DocumentCategory
  status?: DocumentStatus
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface DocumentsPaginationParams {
  page: number
  pageSize: number
  filters?: DocumentFilters
  sortBy?: keyof Document
  sortOrder?: 'asc' | 'desc'
}