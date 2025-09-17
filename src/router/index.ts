import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Import views
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import WordsView from '@/views/WordsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guest: true }
    },
    {
      path: '/words',
      name: 'words',
      component: WordsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/register-word',
      name: 'register-word',
      component: () => import('@/views/RegisterWordView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/practice',
      name: 'practice',
      component: () => import('@/views/PracticeView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Create auth store instance outside the guard
const auth = useAuth()

// Navigation guard
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.isAuthenticated.value) {
      // User is not authenticated, redirect to login
      next({ name: 'login' })
    } else {
      next()
    }
  }
  // Check if the route is for guests only (login/register)
  else if (to.matched.some(record => record.meta.guest)) {
    if (auth.isAuthenticated.value) {
      // User is authenticated, redirect to home
      next({ name: 'home' })
    } else {
      next()
    }
  }
  // Route is public, allow access
  else {
    next()
  }
})

export default router
