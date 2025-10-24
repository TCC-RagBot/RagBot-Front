<template>
  <div class="space-y-6">
    <!-- Search and Filters Bar -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <div class="space-y-4">
        <!-- Search Input -->
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pesquisar documentos
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Digite palavras-chave, título do documento ou conselho..."
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Filters Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de documento
            </label>
            <div class="relative">
              <select
                v-model="filters.type"
                class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none cursor-pointer"
                @change="applyFilters"
              >
                <option value="">Todos os tipos</option>
                <option value="ata">📋 Ata</option>
                <option value="resolucao">📜 Resolução</option>
                <option value="portaria">📄 Portaria</option>
                <option value="edital">📢 Edital</option>
                <option value="regulamento">📖 Regulamento</option>
                <option value="norma">⚖️ Norma</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <div class="relative">
              <select
                v-model="filters.category"
                class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none cursor-pointer"
                @change="applyFilters"
              >
                <option value="">Todas as categorias</option>
                <option value="conselho-universitario">🏛️ Conselho Universitário</option>
                <option value="conselho-ensino-pesquisa-extensao">🎓 Conselho de Ensino, Pesquisa e Extensão</option>
                <option value="conselho-administracao">💼 Conselho de Administração</option>
                <option value="colegiado-curso">👥 Colegiado de Curso</option>
                <option value="congregacao">🏫 Congregação</option>
                <option value="outros">📁 Outros</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <div class="relative">
              <select
                v-model="filters.status"
                class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none cursor-pointer"
                @change="applyFilters"
              >
                <option value="">Todos os status</option>
                <option value="active">✅ Ativo</option>
                <option value="archived">📦 Arquivado</option>
                <option value="draft">✏️ Rascunho</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Clear Filters Button -->
          <div class="flex items-end">
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              🗑️ Limpar filtros
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Info -->
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        <span v-if="!isLoading">
          Mostrando {{ startIndex + 1 }}-{{ Math.min(endIndex, total) }} de {{ total }} documentos
        </span>
        <span v-else>Carregando documentos...</span>
      </div>
      
      <!-- Sort Options -->
      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-600 dark:text-gray-400">Ordenar por:</label>
        <select
          v-model="sortBy"
          class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="applySorting"
        >
          <option value="date">Data</option>
          <option value="title">Título</option>
          <option value="council">Conselho</option>
          <option value="type">Tipo</option>
        </select>
        
        <button
          @click="toggleSortOrder"
          class="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          :aria-label="`Ordenar ${sortOrder === 'desc' ? 'crescente' : 'decrescente'}`"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="sortOrder === 'desc'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
            />
          </svg>
        </button>
      </div>
    </div>

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
                  :class="getTypeBadgeClass(document.type)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ getTypeLabel(document.type) }}
                </span>
                
                <!-- Status Badge -->
                <span
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
                <span>{{ formatDate(document.date) }}</span>
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
              v-if="document.url"
              @click="openDocument(document.url)"
              class="btn-primary flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Visualizar</span>
            </button>
            
            <button
              @click="shareDocument(document)"
              class="btn-secondary flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>Compartilhar</span>
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
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Não há documentos que correspondam aos critérios de pesquisa selecionados.
      </p>
      <button
        @click="clearFilters"
        class="btn-primary"
      >
        Limpar filtros
      </button>
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
import type { Document, DocumentFilters, DocumentType, DocumentStatus } from '../types'
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

const searchQuery = ref('')
const filters = ref<DocumentFilters>({})
const sortBy = ref<keyof Document>('date')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Computed properties
const startIndex = computed(() => (currentPage.value - 1) * props.pageSize)
const endIndex = computed(() => startIndex.value + props.pageSize)

const hasActiveFilters = computed(() => {
  return !!(
    filters.value.type ||
    filters.value.category ||
    filters.value.status ||
    filters.value.dateFrom ||
    filters.value.dateTo ||
    searchQuery.value
  )
})

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
      pageSize: props.pageSize,
      filters: {
        ...filters.value,
        search: searchQuery.value || undefined
      },
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
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

const debouncedSearch = (() => {
  let timeoutId: number
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      currentPage.value = 1
      loadDocuments()
    }, 500)
  }
})()

const applyFilters = () => {
  currentPage.value = 1
  loadDocuments()
}

const applySorting = () => {
  loadDocuments()
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  loadDocuments()
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value = {}
  currentPage.value = 1
  loadDocuments()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    loadDocuments()
  }
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateString))
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

const openDocument = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const shareDocument = async (document: Document) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: document.summary,
        url: document.url || window.location.href
      })
    } catch (err) {
      console.log('Erro ao compartilhar:', err)
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(document.url || window.location.href)
      // You could show a toast notification here
    } catch (err) {
      console.log('Erro ao copiar link:', err)
    }
  }
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