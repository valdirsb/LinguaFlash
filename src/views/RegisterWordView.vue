<template>
  <div class="register-container">
    <h2>Cadastrar Nova Palavra</h2>
    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-group">
        <label for="word">Palavra em Inglês:</label>
        <input 
          type="text" 
          id="word" 
          v-model="formData.word" 
          required
          placeholder="Digite a palavra em inglês"
        >
      </div>

      <div class="form-group">
        <label for="translation">Tradução:</label>
        <input 
          type="text" 
          id="translation" 
          v-model="formData.translation" 
          required
          placeholder="Digite a tradução em português"
        >
      </div>

      <div class="form-group">
        <label for="image">Imagem:</label>
        <input 
          type="file" 
          id="image" 
          @change="handleImageChange" 
          accept="image/*"
          required
        >
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="Preview">
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import type { AxiosError } from 'axios';

const router = useRouter();
const imagePreview = ref<string | null>(null);
const isSubmitting = ref(false);
const error = ref('');

interface FormData {
  word: string;
  translation: string;
  image: File | null;
}

const formData = ref<FormData>({
  word: '',
  translation: '',
  image: null
});

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    formData.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    error.value = '';
    
    const submitData = new FormData();
    submitData.append('word', formData.value.word);
    submitData.append('translation', formData.value.translation);
    if (formData.value.image) {
      submitData.append('image', formData.value.image);
    }

    await api.post('/words', submitData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    alert('Palavra cadastrada com sucesso!');
    router.push('/words');
  } catch (err) {
    const error_ = err as AxiosError;
    console.error('Erro ao cadastrar palavra:', error_);
    if (error_.response?.status === 401) {
      error.value = 'Sessão expirada. Por favor, faça login novamente.';
      router.push('/login');
    } else {
      error.value = (error_.response?.data as any)?.message || 'Erro ao cadastrar palavra. Por favor, tente novamente.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.register-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input[type="file"] {
  display: block;
  margin-top: 5px;
}

.image-preview {
  margin-top: 10px;
  max-width: 200px;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #2980b9;
}

.form-actions {
  text-align: center;
  margin-top: 20px;
}
</style>