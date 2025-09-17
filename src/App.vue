<template>
  <div class="app">
    <nav v-if="isAuthenticated" class="navbar">
      <div class="nav-brand">
        <Logo size="medium" />
      </div>
      
      <!-- Botão do menu mobile -->
      <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen" :aria-expanded="isMenuOpen">
        <span class="menu-icon"></span>
        <span class="sr-only">Menu</span>
      </button>

      <!-- Container para links e área do usuário no mobile -->
      <div class="nav-mobile" :class="{ 'is-open': isMenuOpen }">
        <div class="nav-links">
          <RouterLink to="/" @click="isMenuOpen = false">Home</RouterLink>
          <RouterLink to="/words" @click="isMenuOpen = false">Palavras</RouterLink>
          <RouterLink to="/register-word" @click="isMenuOpen = false">Adicionar Palavra</RouterLink>
          <RouterLink to="/practice" @click="isMenuOpen = false">Praticar</RouterLink>
        </div>
        <div class="nav-user">
          <span v-if="user" class="user-name">{{ user.name }}</span>
          <button @click="handleLogout" class="btn-logout">Sair</button>
        </div>
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
import { onMounted, ref } from 'vue'
import Logo from './components/Logo.vue'

const { isAuthenticated, user, logout, checkAuth } = useAuth()
const router = useRouter()
const isMenuOpen = ref(false)

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
  z-index: 1001;
}

.nav-brand h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.5px;
}

/* Menu Toggle Button */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  position: relative;
  cursor: pointer;
  z-index: 1001;
}

.menu-icon {
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: var(--neutral);
  left: 8px;
  transition: all 0.3s ease;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: var(--neutral);
  transition: all 0.3s ease;
}

.menu-icon::before {
  transform: translateY(-8px);
}

.menu-icon::after {
  transform: translateY(8px);
}

/* Menu Toggle Animation */
.menu-toggle[aria-expanded="true"] .menu-icon {
  background-color: transparent;
}

.menu-toggle[aria-expanded="true"] .menu-icon::before {
  transform: rotate(45deg);
}

.menu-toggle[aria-expanded="true"] .menu-icon::after {
  transform: rotate(-45deg);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Nav Links e User Area */
.nav-mobile {
  display: flex;
  align-items: center;
  gap: 2rem;
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
  white-space: nowrap;
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

/* Media Queries para Responsividade */
@media (max-width: 968px) {
  .navbar {
    padding: 1rem;
  }

  .nav-links {
    margin: 0 1rem;
  }

  .nav-links a {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  .user-name {
    font-size: 0.9rem;
  }

  .btn-logout {
    padding: 0.6rem 1.2rem;
  }
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-mobile {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 400px;
    height: 100vh;
    background: var(--white);
    flex-direction: column;
    justify-content: flex-start;
    padding: 5rem 2rem 2rem;
    transition: all 0.3s ease;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  }

  .nav-mobile.is-open {
    right: 0;
  }

  .nav-links {
    flex-direction: column;
    margin: 0;
    width: 100%;
  }

  .nav-links a {
    width: 100%;
    text-align: center;
  }

  .nav-user {
    flex-direction: column;
    padding: 1.5rem 0 0;
    border-left: none;
    border-top: 2px solid rgba(0, 0, 0, 0.1);
    width: 100%;
  }

  .user-name {
    margin-bottom: 1rem;
  }

  .btn-logout {
    width: 100%;
  }
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