<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <HeaderBar />

    <!-- Main content area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="animate-fade-in">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Documentos da UnB
            </h1>
          </div>
          <p class="text-lg text-gray-600 dark:text-gray-300 w-full leading-relaxed">
            Acesse atas, resoluções, portarias e outros documentos oficiais da Universidade de Brasília. 
            Use os filtros para encontrar informações específicas ou pesquise por palavras-chave.
          </p>
        </div>
      </div>

      <!-- Document List Component -->
      <div class="animate-slide-up">
        <DocumentList />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/shared/components/HeaderBar.vue'
import DocumentList from '../components/DocumentList.vue'

// Set page title
document.title = 'RAGBot UnB - Documentos da Universidade de Brasília'
</script>

<style scoped>
/* Ensure smooth scrolling for the entire page */
html {
  scroll-behavior: smooth;
}
</style>