<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
@import '@/assets/main.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}

body {
  margin: 0;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}
</style>
