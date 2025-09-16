<script setup lang="ts">
import { RouterView } from 'vue-router'
import Logo from './components/Logo.vue'
</script>

<template>
  <header class="app-header">
    <nav>
      <Logo size="medium" />
    </nav>
  </header>
  <main class="app-main">
    <RouterView />
  </main>
  <footer class="app-footer">
    <p>&copy; 2025 LinguaFlash - Aprenda idiomas de forma visual</p>
  </footer>
</template>

<style>
@import '@/assets/main.css';
@import '@/assets/theme.css';
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap');

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
}

.app-header nav {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
