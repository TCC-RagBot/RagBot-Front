<template>
  <div class="chat-bubble chat-bubble-assistant">
    <div class="flex items-start space-x-3">
      <!-- Avatar -->
      <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900 flex items-center justify-center text-sm font-medium">
        A
      </div>

      <!-- Typing content -->
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium mb-1">
          <span class="text-gray-700 dark:text-gray-300">
            RAGBot UnB
          </span>
        </div>
        
        <div class="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
          <span class="text-sm">Digitando</span>
          <div class="flex space-x-1">
            <div class="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-typing" style="animation-delay: 0ms"></div>
            <div class="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-typing" style="animation-delay: 200ms"></div>
            <div class="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-typing" style="animation-delay: 400ms"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>