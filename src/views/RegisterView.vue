<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Register</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            required
            class="form-control"
            placeholder="Enter your name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            class="form-control"
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
            class="form-control"
            placeholder="Enter your password"
            minlength="6"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Loading...' : 'Register' }}
        </button>

        <p class="auth-switch">
          Already have an account?
          <router-link to="/login">Login here</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const { register } = useAuth()
    const loading = ref(false)
    const error = ref('')
    const form = reactive({
      name: '',
      email: '',
      password: ''
    })

    const handleSubmit = async () => {
      try {
        loading.value = true
        error.value = ''
        await register(form.name, form.email, form.password)
        router.push('/')
      } catch (err: any) {
        error.value = err.response?.data?.error || 'An error occurred'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      handleSubmit
    }
  }
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
}

.auth-box {
  background: var(--white);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.5s ease-out;
}

.auth-box h2 {
  color: var(--neutral);
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--neutral);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-control {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
  background-color: var(--white);
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
}

.error-message {
  color: var(--error);
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.btn-primary:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auth-switch {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--neutral);
  font-size: 0.9rem;
}

.auth-switch a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: color 0.3s ease;
}

.auth-switch a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}
</style>