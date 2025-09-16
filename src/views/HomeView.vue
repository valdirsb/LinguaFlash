<template>
  <div class="menu-container">
    <h1 class="menu-title">Prática de Inglês</h1>
    <div class="menu-options">
      <div class="menu-option" @click="navigateTo('words')">
        <h3>Palavras</h3>
        <p>Pratique seu vocabulário</p>
      </div>
      <div class="menu-option disabled">
        <h3>Frases</h3>
        <p>Em breve</p>
      </div>
      <div class="menu-option disabled">
        <h3>Diálogos</h3>
        <p>Em breve</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateTo = (route) => {
  router.push(`/${route}`);
};
</script>

<style scoped>
/* Estilos específicos do componente, se necessário */
</style>