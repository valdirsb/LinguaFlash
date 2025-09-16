import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WordsView from '../views/WordsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/words',
      name: 'words',
      component: WordsView
    },
    {
      path: '/words/register',
      name: 'register-word',
      component: () => import('../views/RegisterWordView.vue')
    },
    {
      path: '/words/practice',
      name: 'practice-words',
      component: () => import('../views/PracticeView.vue')
    }
  ]
})

export default router