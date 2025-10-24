// Documents module exports
export { documentsRoutes } from './router'
export type { 
  Document, 
  DocumentType, 
  DocumentCategory, 
  DocumentStatus,
  DocumentFilters,
  DocumentsResponse,
  DocumentsPaginationParams 
} from './types'

// Components
export { default as DocumentsView } from './views/DocumentsView.vue'
export { default as DocumentList } from './components/DocumentList.vue'

// Services
export { default as DocumentsApiService } from './services/api'