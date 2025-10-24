<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <HeaderBar />

    <!-- Main content area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="animate-fade-in">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Documentos da UnB
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
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