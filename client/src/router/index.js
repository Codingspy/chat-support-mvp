import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '@/components/ChatView.vue'
import AgentDashboard from '@/components/AgentDashboard.vue'

const routes = [
  { path: '/', component: ChatView },
  {
    path: '/agent',
    component: AgentDashboard,
    meta: { requiresAgent: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Optional route guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (to.meta.requiresAgent && user?.role !== 'agent') {
    next('/')
  } else {
    next()
  }
})

export default router
