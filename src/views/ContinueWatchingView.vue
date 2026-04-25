<template>
  <div
    :class="[
      isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900',
      'w-full pt-8 px-4 md:px-12 lg:px-20'
    ]"
  >
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Continue Watching</h1>
        <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
          Pick up where you left off
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
      </div>

      <!-- No Items -->
      <div
        v-else-if="continueWatching.length === 0"
        :class="[
          isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200',
          'p-12 rounded-lg border text-center'
        ]"
      >
        <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
          You haven't started watching anything yet
        </p>

        <router-link
          to="/"
          class="inline-block mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        >
          Explore Movies
        </router-link>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        <div
          v-for="item in continueWatching"
          :key="item.id"
          :class="[
            isDarkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100',
            'rounded-lg overflow-hidden group transition cursor-pointer'
          ]"
          @click="resumeWatching(item)"
        >

          <!-- Thumbnail -->
          <div class="relative aspect-video overflow-hidden bg-gray-800">
            <img
              :src="item.poster_path 
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
                : 'https://via.placeholder.com/300x200?text=No+Image'"
              class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              :alt="item.title"
            />

            <!-- Progress -->
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
              <div class="h-full bg-red-600" :style="{ width: item.progress + '%' }"></div>
            </div>

            <!-- Play Overlay -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition duration-300">
              <button class="opacity-0 group-hover:opacity-100 transition duration-300 p-3 bg-red-600 rounded-full hover:bg-red-700">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="p-4">
            <h3 class="font-bold truncate">{{ item.title || item.name }}</h3>

            <p :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600', 'text-sm mb-2']">
              {{ item.progress }}% watched
            </p>

            <div
              :class="['flex items-center justify-between text-xs', isDarkMode ? 'text-gray-500' : 'text-gray-600']"
            >
              <span>{{ formatTime(item.watch_duration) }} watched</span>
              <span>{{ item.release_date?.split('-')[0] }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="p-4 border-t flex gap-2"
            :class="isDarkMode ? 'border-gray-800' : 'border-gray-200'"
          >
            <button
              @click.stop="resumeWatching(item)"
              class="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition"
            >
              Resume
            </button>

            <button
              @click.stop="removeFromContinue(item.id)"
              class="py-2 px-3 text-sm font-semibold rounded transition"
              :class="isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
            >
              Remove
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const continueWatching = ref([])

const isDarkMode = computed(() => {
  const theme = localStorage.getItem('theme') || 'dark'
  if (theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return theme !== 'light'
})

const formatTime = (seconds) => {
  if (!seconds) return '0m'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')

    // If no token → just stop (don’t redirect here)
    if (!token) {
      loading.value = false
      return
    }

    const response = await fetch('http://localhost:5000/api/movies/continue-watching', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const data = await response.json()

      continueWatching.value = (data.movies || []).map(movie => ({
        ...movie,
        progress: movie.total_duration
          ? Math.round((movie.watch_duration / movie.total_duration) * 100)
          : 0
      }))
    } else {
      // Don’t force redirect — just clear data
      console.warn('Failed to fetch continue watching')
      continueWatching.value = []
    }

  } catch (error) {
    console.error('Error loading continue watching:', error)
  } finally {
    loading.value = false
  }
})

const resumeWatching = (item) => {
  if (!localStorage.getItem('token')) {
    router.push('/signin')
    return
  }
  router.push(`/movie/${item.id}`)
}

const removeFromContinue = async (movieId) => {
  continueWatching.value = continueWatching.value.filter(
    item => item.id !== movieId
  )
}
</script>

<style scoped>
</style>