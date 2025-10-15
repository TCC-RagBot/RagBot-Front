import { createRouter, createWebHistory } from 'vue-router'
import { chatRoutes } from '@/modules/chat/router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...chatRoutes
  ],
})

export default router
