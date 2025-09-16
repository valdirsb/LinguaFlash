<template>
  <div class="words-menu">
    <h2>Palavras</h2>
    <div class="menu-options">
      <div class="menu-option" @click="navigateTo('words/register')">
        <h3>Cadastrar Palavra</h3>
        <p>Adicione novas palavras ao seu vocabulário</p>
      </div>
      <div class="menu-option" @click="navigateTo('words/practice')">
        <h3>Praticar</h3>
        <p>Teste seu conhecimento</p>
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
.words-menu {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}
</style>