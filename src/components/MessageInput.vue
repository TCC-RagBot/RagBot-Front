<template>
  <div class="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
    <div class="max-w-3xl mx-auto">
      <form @submit.prevent="handleSubmit" class="flex flex-col space-y-3">
        <!-- Textarea -->
        <div class="relative">
          <textarea
            ref="textareaRef"
            v-model="message"
            @keydown="handleKeyDown"
            :disabled="isLoading"
            :placeholder="placeholder"
            class="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{ 'min-h-[120px]': message.includes('\n') }"
            rows="1"
            :aria-label="placeholder"
          />
          
          <!-- Character count (optional, for very long messages) -->
          <div
            v-if="message.length > 500"
            class="absolute bottom-2 right-12 text-xs text-gray-400 dark:text-gray-500"
          >
            {{ message.length }}/2000
          </div>
        </div>

        <!-- Controls row -->
        <div class="flex items-center justify-between">
          <!-- Helper text -->
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <kbd class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">Enter</kbd>
            para enviar,
            <kbd class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">Shift+Enter</kbd>
            para nova linha
          </div>

          <!-- Send button -->
          <button
            type="submit"
            :disabled="isLoading || !message.trim()"
            class="btn-primary flex items-center space-x-2"
            :aria-label="isLoading ? 'Enviando mensagem...' : 'Enviar mensagem'"
          >
            <span v-if="!isLoading">Enviar</span>
            <span v-else>Enviando...</span>
            
            <!-- Loading spinner -->
            <svg
              v-if="isLoading"
              class="animate-spin -mr-1 ml-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            
            <!-- Send icon -->
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

interface Props {
  isLoading?: boolean
  placeholder?: string
}

interface Emits {
  (e: 'submit', message: string): void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  placeholder: 'Digite sua pergunta sobre as atas da UnB...'
})

const emit = defineEmits<Emits>()

const message = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

const handleSubmit = () => {
  const trimmedMessage = message.value.trim()
  
  if (!trimmedMessage || props.isLoading) {
    return
  }

  emit('submit', trimmedMessage)
  message.value = ''
  
  // Reset textarea height
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  })
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}

// Auto-resize textarea
const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    const maxHeight = 200 // Max height in pixels
    const scrollHeight = textareaRef.value.scrollHeight
    textareaRef.value.style.height = `${Math.min(scrollHeight, maxHeight)}px`
  }
}

watch(message, () => {
  nextTick(adjustTextareaHeight)
})
</script>

<style scoped>
textarea {
  min-height: 48px;
  max-height: 200px;
  line-height: 1.5;
}

/* Hide scrollbar but keep functionality */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

.dark textarea::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}
</style>