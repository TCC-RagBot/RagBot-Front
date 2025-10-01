<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <HeaderBar />

    <!-- Main content area -->
    <main class="flex flex-col min-h-[calc(100vh-4rem)]">
      <!-- Messages area -->
      <div class="flex-1 px-4 py-8 overflow-y-auto">
        <!-- Welcome message (shown when no messages) -->
        <div
          v-if="messages.length === 0"
          class="max-w-3xl mx-auto text-center py-16"
        >
          <div class="animate-fade-in">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Bem-vindo ao RAGBot UnB
            </h1>
            <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Faça sua pergunta sobre as atas da Universidade de Brasília e obtenha respostas precisas baseadas em documentos oficiais.
            </p>
            
            <!-- Example questions -->
            <div class="grid gap-3 md:grid-cols-2 max-w-2xl mx-auto">
              <button
                v-for="example in exampleQuestions"
                :key="example"
                @click="handleExampleClick(example)"
                :disabled="isLoading"
                class="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-start space-x-3">
                  <svg
                    class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                    {{ example }}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Chat messages -->
        <div v-else class="space-y-4">
          <ChatBubble
            v-for="message in messages"
            :key="message.id"
            :role="message.role"
            :content="message.content"
          />
          
          <!-- Typing indicator -->
          <TypingIndicator v-if="isLoading" />
        </div>

        <!-- Error message -->
        <div
          v-if="errorMessage"
          class="max-w-3xl mx-auto mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slide-up"
        >
          <div class="flex items-start space-x-3">
            <svg
              class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 class="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                Erro ao obter resposta
              </h4>
              <p class="text-sm text-red-700 dark:text-red-300">
                {{ errorMessage }}
              </p>
              <button
                @click="retryLastMessage"
                class="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors duration-200"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Message input -->
      <MessageInput
        :is-loading="isLoading"
        @submit="handleMessageSubmit"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import HeaderBar from '@/components/HeaderBar.vue'
import ChatBubble from '@/components/ChatBubble.vue'
import MessageInput from '@/components/MessageInput.vue'
import TypingIndicator from '@/components/TypingIndicator.vue'
import ApiService from '@/services/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const messages = ref<Message[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const lastUserMessage = ref('')

const exampleQuestions = [
  'Quais são as principais decisões do último conselho universitário?',
  'Como funciona o processo de aprovação de novos cursos na UnB?',
  'Quais são as políticas de pesquisa e extensão aprovadas?',
  'Qual é o orçamento atual da universidade?'
]

const generateMessageId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const scrollToBottom = () => {
  nextTick(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
  })
}

const addMessage = (role: 'user' | 'assistant', content: string) => {
  const message: Message = {
    id: generateMessageId(),
    role,
    content,
    timestamp: new Date()
  }
  
  messages.value.push(message)
  scrollToBottom()
}

const handleMessageSubmit = async (message: string) => {
  if (!message.trim() || isLoading.value) {
    return
  }

  // Clear any previous error
  errorMessage.value = ''
  lastUserMessage.value = message

  // Add user message
  addMessage('user', message)
  
  // Set loading state
  isLoading.value = true

  try {
    const response = await ApiService.sendMessage(message)
    
    if (response.success) {
      addMessage('assistant', response.answer)
    } else {
      errorMessage.value = response.error || 'Não foi possível obter a resposta. Tente novamente.'
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    errorMessage.value = 'Não foi possível obter a resposta. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

const handleExampleClick = (example: string) => {
  handleMessageSubmit(example)
}

const retryLastMessage = () => {
  if (lastUserMessage.value) {
    errorMessage.value = ''
    handleMessageSubmit(lastUserMessage.value)
  }
}

// Set page title
document.title = 'RAGBot UnB - Chat sobre atas da Universidade de Brasília'
</script>

<style scoped>
/* Ensure smooth scrolling for the entire page */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}
</style>