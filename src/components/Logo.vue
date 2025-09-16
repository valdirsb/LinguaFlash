<template>
  <div class="logo-container" :class="size">
    <div class="logo-symbol">
      <span class="flash">⚡</span>
      <span class="globe">🌎</span>
    </div>
    <h1 class="logo-text" v-if="showText">
      <span class="lingua">Lingua</span><span class="flash-text">Flash</span>
    </h1>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  showText: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-symbol {
  position: relative;
  display: flex;
  align-items: center;
}

.flash, .globe {
  font-size: 1.5em;
  transition: transform 0.3s ease;
}

.flash {
  position: absolute;
  transform: rotate(-15deg);
  left: -5px;
  top: -5px;
}

.logo-text {
  font-family: var(--font-primary);
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, var(--primary) 30%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lingua {
  color: var(--primary);
}

.flash-text {
  color: var(--accent);
}

/* Tamanhos do logo */
.small .flash, .small .globe {
  font-size: 1.2em;
}
.small .logo-text {
  font-size: 1.2em;
}

.medium .flash, .medium .globe {
  font-size: 1.5em;
}
.medium .logo-text {
  font-size: 1.8em;
}

.large .flash, .large .globe {
  font-size: 2em;
}
.large .logo-text {
  font-size: 2.5em;
}

/* Animação hover */
.logo-container:hover .flash {
  transform: rotate(-15deg) scale(1.1);
}

.logo-container:hover .globe {
  transform: scale(1.1);
}
</style>