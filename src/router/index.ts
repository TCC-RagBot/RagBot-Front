import { createRouter, createWebHistory } from 'vue-router'
import { chatRoutes } from '@/modules/chat/router'
import { documentsRoutes } from '@/modules/documents/router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...chatRoutes,
    ...documentsRoutes
  ],
})

export default router
