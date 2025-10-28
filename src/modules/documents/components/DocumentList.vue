<template>
  <div class="space-y-6">

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Erro ao carregar documentos</h3>
      <p class="text-red-700 dark:text-red-300 mb-4">{{ error }}</p>
      <button
        @click="loadDocuments"
        class="btn-primary"
      >
        Tentar novamente
      </button>
    </div>

    <!-- Documents Grid -->
    <div v-else-if="documents.length > 0" class="grid gap-4 md:gap-6">
      <div
        v-for="document in documents"
        :key="document.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 animate-fade-in"
      >
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <!-- Document Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                {{ document.title }}
              </h3>
              <div class="flex items-center space-x-2 ml-4 flex-shrink-0">
                <!-- Document Type Badge -->
                <span
                  v-if="document.type"
                  :class="getTypeBadgeClass(document.type)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ getTypeLabel(document.type) }}
                </span>
                
                <!-- Status Badge -->
                <span
                  v-if="document.status"
                  :class="getStatusBadgeClass(document.status)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ getStatusLabel(document.status) }}
                </span>
              </div>
            </div>
            
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">
              {{ document.summary }}
            </p>
            
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(document.date || document.uploaded_at) }}</span>
              </div>
              
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{{ document.council }}</span>
              </div>
              
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ document.pageCount }} páginas</span>
              </div>
              
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>{{ document.fileSize }}</span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-2 flex-shrink-0">
            <button
              @click="deleteDocument(document)"
              :disabled="isDeleting === document.id"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg 
                v-if="isDeleting === document.id" 
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              
              <svg 
                v-else
                class="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              
              <span>
                {{ isDeleting === document.id ? 'Excluindo...' : 'Excluir' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Nenhum documento encontrado</h3>
      <p class="text-gray-600 dark:text-gray-400">
        Não há documentos disponíveis no momento.
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-lg">
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </div>
      
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando
            <span class="font-medium">{{ startIndex + 1 }}</span>
            a
            <span class="font-medium">{{ Math.min(endIndex, total) }}</span>
            de
            <span class="font-medium">{{ total }}</span>
            resultados
          </p>
        </div>
        
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-blue-50 dark:bg-blue-900/50 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ page }}
            </button>
            
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Document, DocumentType, DocumentStatus } from '../types'
import DocumentsApiService from '../services/api'

// Props
interface Props {
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10
})

// Reactive state
const documents = ref<Document[]>([])
const total = ref(0)
const currentPage = ref(1)
const totalPages = ref(0)
const isLoading = ref(false)
const error = ref('')
const isDeleting = ref<string | null>(null)

// Computed properties
const startIndex = computed(() => (currentPage.value - 1) * props.pageSize)
const endIndex = computed(() => startIndex.value + props.pageSize)

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 7
  const half = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, currentPage.value - half)
  const end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const loadDocuments = async () => {
  if (isLoading.value) return

  isLoading.value = true
  error.value = ''

  try {
    const response = await DocumentsApiService.getDocuments({
      page: currentPage.value,
      pageSize: props.pageSize
    })

    if (response.success) {
      documents.value = response.documents
      total.value = response.total
      totalPages.value = response.totalPages
    } else {
      error.value = response.error || 'Erro ao carregar documentos'
    }
  } catch (err) {
    console.error('Erro ao carregar documentos:', err)
    error.value = 'Erro ao carregar documentos'
  } finally {
    isLoading.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    loadDocuments()
  }
}



const deleteDocument = async (document: Document) => {
  const confirmDelete = confirm(`Tem certeza que deseja excluir o documento "${document.title || document.filename}"?`)
  
  if (!confirmDelete) return

  isDeleting.value = document.id
  
  try {
    const result = await DocumentsApiService.deleteDocument(document.id)
    
    if (result.success) {
      // Remove o documento da lista local
      documents.value = documents.value.filter(doc => doc.id !== document.id)
      total.value = Math.max(0, total.value - 1)
      
      // Se a página atual ficou vazia e não é a primeira página, volta uma página
      if (documents.value.length === 0 && currentPage.value > 1) {
        currentPage.value = currentPage.value - 1
        loadDocuments()
      } else if (documents.value.length === 0 && currentPage.value === 1) {
        // Se é a primeira página e ficou vazia, recarrega para mostrar mensagem de "sem documentos"
        loadDocuments()
      }
      
      // Mostrar mensagem de sucesso (opcional)
      console.log('Documento excluído com sucesso')
    } else {
      alert(`Erro ao excluir documento: ${result.error}`)
    }
  } catch (err) {
    console.error('Erro ao excluir documento:', err)
    alert('Erro inesperado ao excluir documento')
  } finally {
    isDeleting.value = null
  }
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Data não disponível'
  
  const date = dateString.includes('T') ? dateString.split('T')[0] : dateString
  if (!date) return 'Data não disponível'
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

const getTypeLabel = (type: DocumentType): string => {
  const labels = {
    ata: 'Ata',
    resolucao: 'Resolução',
    portaria: 'Portaria',
    edital: 'Edital',
    regulamento: 'Regulamento',
    norma: 'Norma'
  }
  return labels[type]
}

const getTypeBadgeClass = (type: DocumentType): string => {
  const classes = {
    ata: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    resolucao: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    portaria: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    edital: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    regulamento: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    norma: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
  }
  return classes[type]
}

const getStatusLabel = (status: DocumentStatus): string => {
  const labels = {
    active: 'Ativo',
    archived: 'Arquivado',
    draft: 'Rascunho'
  }
  return labels[status]
}

const getStatusBadgeClass = (status: DocumentStatus): string => {
  const classes = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    draft: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
  }
  return classes[status]
}

// Watchers
watch(() => currentPage.value, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Lifecycle
onMounted(() => {
  loadDocuments()
})
</script>

<style scoped>
/* Custom select styling */
select {
  background-image: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Remove default arrow in IE */
select::-ms-expand {
  display: none;
}

/* Custom scrollbar for select elements */
select::-webkit-scrollbar {
  width: 6px;
}

select::-webkit-scrollbar-track {
  background: transparent;
}

select::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

select::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

.dark select::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark select::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}

/* Ensure consistent styling across browsers */
select option {
  background-color: white;
  color: #374151;
  padding: 8px 12px;
}

.dark select option {
  background-color: #374151;
  color: #f3f4f6;
}

/* Focus states */
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Hover states */
select:hover {
  border-color: #9ca3af;
}

.dark select:hover {
  border-color: #6b7280;
}
</style>