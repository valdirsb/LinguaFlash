<template>
  <div class="app">
    <nav v-if="isAuthenticated" class="navbar">
      <div class="nav-brand">
        <Logo size="medium" />
      </div>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/words">Palavras</RouterLink>
        <RouterLink to="/register-word">Adicionar Palavra</RouterLink>
        <RouterLink to="/practice">Praticar</RouterLink>
      </div>
      <div class="nav-user">
        <span v-if="user" class="user-name">{{ user.name }}</span>
        <button @click="handleLogout" class="btn-logout">Sair</button>
      </div>
    </nav>
    <main class="app-main">
      <RouterView />
    </main>
    <footer class="app-footer">
      <p>&copy; 2025 LinguaFlash - Aprenda idiomas de forma visual</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import Logo from './components/Logo.vue'

const { isAuthenticated, user, logout, checkAuth } = useAuth()
const router = useRouter()

onMounted(async () => {
  await checkAuth()
})

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style>
@import '@/assets/main.css';
@import '@/assets/theme.css';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: var(--white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.95);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-brand h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 0 2rem;
}

.nav-links a {
  color: var(--neutral);
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: var(--primary);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  width: 80%;
}

.nav-links a:hover {
  color: var(--primary);
  background: rgba(52, 152, 219, 0.1);
}

.nav-links a.router-link-active {
  color: var(--primary);
  background: rgba(52, 152, 219, 0.15);
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-left: 1.5rem;
  border-left: 2px solid rgba(0, 0, 0, 0.1);
}

.user-name {
  font-weight: 600;
  color: var(--neutral);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-name::before {
  content: '👤';
  font-size: 1.2rem;
}

.btn-logout {
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  border: none;
  border-radius: 8px;
  color: var(--white);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.btn-logout:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.app-main {
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.app-footer {
  background-color: var(--neutral);
  color: var(--white);
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>