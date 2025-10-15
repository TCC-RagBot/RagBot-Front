import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const isLoading = ref(false)
  const errorMessage = ref<string>('')

  // Computed
  const messageCount = computed(() => messages.value.length)
  const lastMessage = computed(() => messages.value[messages.value.length - 1])

  // Actions
  function addMessage(text: string, isUser: boolean) {
    const newMessage: Message = {
      id: Date.now(),
      text,
      isUser,
      timestamp: new Date()
    }
    messages.value.push(newMessage)
    return newMessage
  }

  function clearMessages() {
    messages.value = []
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(error: string) {
    errorMessage.value = error
  }

  function clearError() {
    errorMessage.value = ''
  }

  return {
    // State
    messages,
    isLoading,
    errorMessage,
    
    // Getters
    messageCount,
    lastMessage,
    
    // Actions
    addMessage,
    clearMessages,
    setLoading,
    setError,
    clearError
  }
})