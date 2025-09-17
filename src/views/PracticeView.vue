<template>
  <div class="practice-container" v-if="!showResults">
    <div class="score-info">
      <span>Acertos: {{ score.correct }}</span>
      <span>Erros: {{ score.incorrect }}</span>
    </div>

    <div class="word-container" v-if="currentWord">
      <h2>{{ currentWord.word }}</h2>
      <div class="translation-container">
        <button class="translate-btn" @click="showTranslation = !showTranslation">
          Traduzir
        </button>
        <div class="popover" v-if="showTranslation">
          {{ currentWord.translation }}
        </div>
      </div>
      <div class="options-grid">
        <div 
          v-for="option in currentOptions" 
          :key="option.id"
          class="option"
          :class="{ 
            'correct': showFeedback && option.id === currentWord.id,
            'incorrect': showFeedback && selectedOption === option.id && option.id !== currentWord.id
          }"
          @click="selectOption(option.id)"
        >
          <img :src="getImageUrl(option.image_url)" :alt="option.word">
        </div>
      </div>
    </div>

    <div class="practice-actions">
      <button @click="endPractice" class="end-button">Encerrar Treinamento</button>
    </div>
  </div>

  <div class="results-container" v-else>
    <h2>Resultado do Treinamento</h2>
    <div class="results-content">
      <p>Total de palavras: {{ score.correct + score.incorrect }}</p>
      <p>Acertos: {{ score.correct }}</p>
      <p>Erros: {{ score.incorrect }}</p>
      <p>Porcentagem de acertos: {{ calculatePercentage() }}%</p>
    </div>
    <button @click="restartPractice" class="restart-button">Praticar Novamente</button>
    <button @click="goToMenu" class="menu-button">Voltar ao Menu</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import type { AxiosError } from 'axios';
import { UPLOADS_URL } from '@/config/constants';

interface Word {
  id: number;
  word: string;
  translation: string;
  image_url: string;
}

const router = useRouter();
const words = ref<Word[]>([]);
const currentWord = ref<Word | null>(null);
const currentOptions = ref<Word[]>([]);
const showFeedback = ref(false);
const selectedOption = ref<number | null>(null);
const showResults = ref(false);
const showTranslation = ref(false);
const score = ref({
  correct: 0,
  incorrect: 0
});

const getImageUrl = (imageUrl: string) => {
  return `${UPLOADS_URL}/${imageUrl}`;
};

const fetchWords = async () => {
  try {
    const response = await api.get<Word[]>('/words');
    words.value = response.data;
    if (words.value.length < 4) {
      alert('É necessário cadastrar pelo menos 4 palavras para iniciar o treino.');
      router.push('/words');
      return;
    }
    setupNextWord();
  } catch (error) {
    const err = error as AxiosError;
    console.error('Erro ao buscar palavras:', err);
    if (err.response?.status === 401) {
      router.push('/login');
    } else {
      alert('Erro ao carregar palavras. Por favor, tente novamente.');
    }
  }
};

const getRandomWords = (count, exclude) => {
  const availableWords = words.value.filter(w => w.id !== exclude.id);
  const shuffled = [...availableWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const setupNextWord = () => {
  if (words.value.length < 4) return;
  
  showFeedback.value = false;
  selectedOption.value = null;
  
  // Seleciona uma palavra aleatória
  const randomIndex = Math.floor(Math.random() * words.value.length);
  currentWord.value = words.value[randomIndex];
  
  // Gera opções aleatórias incluindo a palavra correta
  const otherOptions = getRandomWords(3, currentWord.value);
  currentOptions.value = [...otherOptions, currentWord.value]
    .sort(() => 0.5 - Math.random());
};

const selectOption = async (optionId) => {
  if (showFeedback.value) return;
  
  selectedOption.value = optionId;
  showFeedback.value = true;
  
  if (optionId === currentWord.value.id) {
    score.value.correct++;
  } else {
    score.value.incorrect++;
  }
  
  // Aguarda um momento para mostrar o feedback antes de passar para a próxima palavra
  setTimeout(() => {
    setupNextWord();
  }, 1500);
};

const calculatePercentage = () => {
  const total = score.value.correct + score.value.incorrect;
  if (total === 0) return 0;
  return Math.round((score.value.correct / total) * 100);
};

const endPractice = () => {
  showResults.value = true;
};

const restartPractice = () => {
  score.value = { correct: 0, incorrect: 0 };
  showResults.value = false;
  setupNextWord();
};

const goToMenu = () => {
  router.push('/words');
};

onMounted(() => {
  fetchWords();
});
</script>

<style scoped>
.practice-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.score-info {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  font-size: 1.2em;
}

.word-container {
  text-align: center;
  margin-bottom: 30px;
}

.word-container h2 {
  font-size: 2em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.translation-container {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.translate-btn {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.translate-btn:hover {
  background-color: #2980b9;
}

.popover {
  position: absolute;
  top: 100%;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 5px;
  z-index: 1000;
  font-size: 1em;
  color: #2c3e50;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.option {
  background: white;
  border: 2px solid #3498db;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.option:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.option.correct {
  border-color: #27ae60;
  background-color: rgba(39, 174, 96, 0.1);
}

.option.incorrect {
  border-color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

.practice-actions {
  text-align: center;
  margin-top: 20px;
}

.end-button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.results-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.results-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.results-content p {
  font-size: 1.2em;
  margin: 10px 0;
}

.restart-button, .menu-button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.restart-button {
  background-color: #3498db;
  color: white;
}

.menu-button {
  background-color: #95a5a6;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style>