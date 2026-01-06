<template>
  <div class="min-h-screen bg-[#121212] text-white pt-20 md:pt-24 px-4 md:px-8 lg:px-12">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-[#F5C518] mb-4"></div>
      <p class="text-gray-400 font-medium">Searching MovieBox...</p>
    </div>

    <!-- Results -->
    <div v-else>
      <div class="mb-8 border-b border-gray-800 pb-4">
        <h1 class="text-2xl md:text-3xl font-bold">
          Results for <span class="text-[#F5C518]">"{{ searchQuery }}"</span>
        </h1>
      </div>

      <!-- Results Grid -->
      <div v-if="results.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <MovieCard
          v-for="movie in results"
          :key="movie.id"
          :movie="movie"
          @select="openModal"
        />
      </div>

      <!-- No Results -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <div class="bg-gray-800/50 p-6 rounded-full mb-4">
          <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">No matches found</h2>
        <p class="text-gray-400">Try checking your spelling or use different keywords.</p>
      </div>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <MovieModal v-if="selectedMovie" :movie="selectedMovie" @close="selectedMovie = null" />
    </teleport>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'
import MovieModal from '@/components/MovieModal.vue'
import { MovieAPI } from '@/services/api'

const route = useRoute()
const results = ref([])
const loading = ref(false)
const selectedMovie = ref(null)

const searchQuery = computed(() => route.query.q?.trim() || '')

const performSearch = async () => {
  if (!searchQuery.value) return
  
  loading.value = true
  try {
    const response = await MovieAPI.searchMovies(searchQuery.value)
    // Handle both direct array or TMDB result object
    results.value = response.results || response || []
  } catch (error) {
    console.error('Search failed:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

const openModal = (movie) => {
  selectedMovie.value = movie
}

watch(() => route.query.q, performSearch, { immediate: true })
</script>