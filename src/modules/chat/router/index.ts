import type { RouteRecordRaw } from 'vue-router'

const ChatView = () => import('../views/ChatView.vue')

export const chatRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'chat',
    component: ChatView,
    meta: {
      title: 'RAGBot UnB - Chat'
    }
  }
]