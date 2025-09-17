import { ref, reactive, computed } from 'vue'
import api from '@/api/axios'

interface User {
  id: number
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
}

const state = reactive({
  user: null as User | null,
  token: localStorage.getItem('token')
})

export function useAuth() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!state.token && !!state.user)

  // Load user data if we have a token but no user
  const loadUser = async () => {
    if (state.token && !state.user) {
      try {
        const response = await api.get('/auth/me')
        state.user = response.data
      } catch (err) {
        logout()
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/auth/login', {
        email,
        password
      })

      const { token } = response.data
      state.token = token
      localStorage.setItem('token', token)
      
      await loadUser()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      })

      const { token } = response.data
      state.token = token
      localStorage.setItem('token', token)
      
      await loadUser()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to register'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    state.token = null
    state.user = null
    localStorage.removeItem('token')
  }

  // Try to load user data if we have a token
  const checkAuth = async () => {
    if (state.token) {
      await loadUser()
    }
  }

  return {
    user: computed(() => state.user),
    isAuthenticated,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    login,
    register,
    logout,
    checkAuth
  }
}