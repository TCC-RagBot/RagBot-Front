// Chat module exports
export { useChatStore } from './stores/chatStore'
export { chatRoutes } from './router'
export type { Message } from './stores/chatStore'

// Components
export { default as ChatView } from './views/ChatView.vue'
export { default as ChatBubble } from './components/ChatBubble.vue'
export { default as MessageInput } from './components/MessageInput.vue'
export { default as TypingIndicator } from './components/TypingIndicator.vue'

// Services
export { default as ApiService } from './services/api'