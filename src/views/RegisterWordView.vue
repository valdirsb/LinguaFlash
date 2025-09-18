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
        <div class="image-options">
          <input 
            type="file" 
            id="image" 
            @change="handleImageChange" 
            accept="image/*"
            :required="!formData.image"
          >
          <button type="button" @click="showImageSearch = true" class="search-btn">
            Buscar na Internet
          </button>
        </div>
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

    <!-- Modal de busca de imagens -->
    <div v-if="showImageSearch" class="modal-overlay" @click="closeImageSearch">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Buscar Imagem na Internet</h3>
          <button type="button" @click="closeImageSearch" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="search-form">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Digite o que você quer buscar..."
              @keyup.enter="searchImages"
            >
            <button type="button" @click="searchImages" :disabled="isSearching">
              {{ isSearching ? 'Buscando...' : 'Buscar' }}
            </button>
          </div>
          
          <div v-if="searchError" class="search-error">
            {{ searchError }}
          </div>

          <div v-if="pixabayImages.length > 0" class="images-grid">
            <div 
              v-for="image in pixabayImages" 
              :key="image.id"
              class="image-item"
              @click="selectImage(image)"
            >
              <img :src="image.previewURL" :alt="image.tags">
              <div class="image-info">
                <small>{{ image.tags }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import type { AxiosError } from 'axios';
import { usePixabayImages } from '@/composables/usePixabayImages';
import type { PixabayImage } from '@/composables/usePixabayImages';

const router = useRouter();
const imagePreview = ref<string | null>(null);
const isSubmitting = ref(false);
const error = ref('');

// Pixabay search state
const showImageSearch = ref(false);
const searchQuery = ref('');
const isSearching = ref(false);
const searchError = ref('');
const { images: pixabayImages, isLoading, error: pixabayError, searchImages: searchPixabayImages } = usePixabayImages();

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

// Pixabay image search functions
const closeImageSearch = () => {
  showImageSearch.value = false;
  searchQuery.value = '';
  searchError.value = '';
};

const searchImages = async () => {
  if (!searchQuery.value.trim()) {
    searchError.value = 'Digite um termo para buscar';
    return;
  }
  
  isSearching.value = true;
  searchError.value = '';
  
  try {
    await searchPixabayImages(searchQuery.value);
    if (pixabayError.value) {
      searchError.value = pixabayError.value;
    }
  } catch (err) {
    searchError.value = 'Erro ao buscar imagens. Tente novamente.';
  } finally {
    isSearching.value = false;
  }
};

const selectImage = async (image: PixabayImage) => {
  try {
    isSearching.value = true;
    searchError.value = '';
    
    // Download da imagem diretamente no frontend
    const response = await fetch(image.webformatURL);
    const blob = await response.blob();
    
    // Extrair extensão da URL ou usar jpg como padrão
    const urlParts = image.webformatURL.split('.');
    const extension = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';
    const filename = `pixabay-${image.id}.${extension}`;
    
    // Criar objeto File com o blob baixado
    const file = new File([blob], filename, { type: blob.type });
    
    formData.value.image = file;
    imagePreview.value = URL.createObjectURL(blob);
    
    closeImageSearch();
  } catch (err) {
    console.error('Erro ao selecionar imagem:', err);
    searchError.value = 'Erro ao baixar imagem. Tente novamente.';
  } finally {
    isSearching.value = false;
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

/* Image options */
.image-options {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.search-btn {
  background-color: #27ae60;
  font-size: 14px;
  padding: 8px 15px;
}

.search-btn:hover:not(:disabled) {
  background-color: #219a52;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #34495e;
}

.modal-body {
  padding: 20px;
}

.search-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-form input {
  flex: 1;
}

.search-error {
  color: #e74c3c;
  margin-bottom: 15px;
  text-align: center;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.image-item {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.image-item:hover {
  border-color: #3498db;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.image-info {
  padding: 8px;
  background-color: #f8f9fa;
  text-align: center;
}

.image-info small {
  color: #6c757d;
  font-size: 12px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  border: 1px solid #f5c6cb;
}
</style>