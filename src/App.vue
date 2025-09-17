<template>
  <div class="app">
    <nav v-if="isAuthenticated" class="navbar">
      <div class="nav-brand">
        <Logo size="medium" />
        <h1>LinguaFlash</h1>
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  margin-bottom: 2rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-brand h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--color-heading);
  background: var(--color-background-mute);
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background: var(--color-background-mute);
  border: none;
  border-radius: 4px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: var(--color-background);
  color: var(--color-heading);
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