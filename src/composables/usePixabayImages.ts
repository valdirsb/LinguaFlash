import { ref } from 'vue'
import axios from 'axios'
import { PIXABAY_API_URL, PIXABAY_API_KEY } from '@/config/constants'

export interface PixabayImage {
  id: number
  webformatURL: string
  tags: string
  user: string
  views: number
  downloads: number
  likes: number
  previewURL: string
}

export interface PixabayResponse {
  total: number
  totalHits: number
  hits: PixabayImage[]
}

export function usePixabayImages() {
  const images = ref<PixabayImage[]>([])
  const isLoading = ref(false)
  const error = ref<string>('')

  const searchImages = async (query: string, page: number = 1, perPage: number = 20) => {
    if (!query.trim()) {
      error.value = 'Digite um termo de busca'
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const response = await axios.get<PixabayResponse>(PIXABAY_API_URL, {
        params: {
          key: PIXABAY_API_KEY,
          q: encodeURIComponent(query),
          image_type: 'photo',
          orientation: 'all',
          category: 'all',
          min_width: 640,
          min_height: 480,
          safesearch: 'true',
          page: page,
          per_page: perPage
        }
      })

      if (page === 1) {
        images.value = response.data.hits
      } else {
        images.value.push(...response.data.hits)
      }
    } catch (err) {
      console.error('Erro ao buscar imagens:', err)
      error.value = 'Erro ao buscar imagens. Tente novamente.'
      images.value = []
    } finally {
      isLoading.value = false
    }
  }

  const clearImages = () => {
    images.value = []
    error.value = ''
  }

  return {
    images,
    isLoading,
    error,
    searchImages,
    clearImages
  }
}