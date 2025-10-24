import type { RouteRecordRaw } from 'vue-router'

const DocumentsView = () => import('../views/DocumentsView.vue')

export const documentsRoutes: RouteRecordRaw[] = [
  {
    path: '/documentos',
    name: 'documents',
    component: DocumentsView,
    meta: {
      title: 'RAGBot UnB - Documentos'
    }
  }
]