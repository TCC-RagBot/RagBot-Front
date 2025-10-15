<template>
  <div
    :class="[
      'chat-bubble',
      role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
    ]"
    :aria-label="`Mensagem do ${role === 'user' ? 'usuário' : 'assistente'}`"
  >
    <div class="flex items-start space-x-3">
      <!-- Avatar -->
      <div
        :class="[
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
          role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900'
        ]"
      >
        {{ role === 'user' ? 'U' : 'A' }}
      </div>

      <!-- Message content -->
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium mb-1">
          <span
            :class="[
              role === 'user'
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300'
            ]"
          >
            {{ role === 'user' ? 'Você' : 'RAGBot UnB' }}
          </span>
        </div>
        
        <!-- Message text with Markdown support -->
        <div
          v-if="role === 'assistant'"
          class="prose prose-sm max-w-none dark:prose-invert prose-blue"
          v-html="renderedContent"
        />
        <div
          v-else
          class="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed"
        >
          {{ content }}
        </div>

        <!-- Timestamp -->
        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {{ timestamp }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

interface Props {
  role: 'user' | 'assistant'
  content: string
}

const props = defineProps<Props>()

// Configure marked for safe HTML output
marked.setOptions({
  breaks: true,
  gfm: true
})

const renderedContent = computed(() => {
  if (props.role === 'assistant') {
    return marked.parse(props.content)
  }
  return props.content
})

const timestamp = computed(() => {
  return new Intl.DateTimeFormat(navigator.language, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date())
})
</script>

<style scoped>
/* Custom prose styles for better dark mode support */
:deep(.prose) {
  @apply text-gray-900 dark:text-gray-100;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4) {
  @apply text-gray-900 dark:text-gray-100 font-semibold;
}

:deep(.prose p) {
  @apply mb-4 last:mb-0;
}

:deep(.prose ul),
:deep(.prose ol) {
  @apply mb-4;
}

:deep(.prose li) {
  @apply mb-1;
}

:deep(.prose code) {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1 py-0.5 rounded text-sm;
}

:deep(.prose pre) {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-lg overflow-x-auto;
}

:deep(.prose pre code) {
  @apply bg-transparent p-0;
}

:deep(.prose a) {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200;
}

:deep(.prose blockquote) {
  @apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300;
}
</style>