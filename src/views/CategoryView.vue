<template>
  <div class="min-h-screen bg-[#121212] text-white pt-20 md:pt-24 px-4 md:px-8 lg:px-12">
    <!-- Header -->
    <header class="flex items-end justify-between mb-8 border-b border-gray-800 pb-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white">
          {{ pageTitle }}
        </h1>
        <p class="text-gray-400 text-sm mt-1">Browse the best quality content</p>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center h-[50vh]">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-[#F5C518]"></div>
    </div>

    <!-- Content Grid -->
    <div v-else-if="content.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 pb-20">
      <MovieCard
        v-for="item in content"
        :key="item.id"
        :movie="item"
        @select="openModal"
      />
    </div>

    <!-- Error/Empty State -->
    <div v-else class="text-center py-20 bg-[#1a1a1a] rounded-xl mt-10">
      <h3 class="text-xl font-bold text-gray-300">No content found</h3>
      <p class="text-gray-500 mt-2">We couldn't load the videos for this category.</p>
      <button 
        @click="loadData" 
        class="mt-6 px-6 py-2 bg-[#F5C518] text-black font-bold rounded hover:bg-[#d4a910] transition"
      >
        Retry
      </button>
    </div>

    <teleport to="body">
      <MovieModal v-if="selectedMovie" :movie="selectedMovie" @close="selectedMovie = null" />
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'
import MovieModal from '@/components/MovieModal.vue'
import { MovieAPI } from '@/services/api'

const route = useRoute()
const content = ref([])
const loading = ref(true)
const selectedMovie = ref(null)

const pageTitle = computed(() => {
  if (route.path.includes('tv-shows')) return 'TV Series'
  if (route.path.includes('movies')) return 'Movies'
  if (route.path.includes('new-popular')) return 'Trending Now'
  if (route.path.includes('my-list')) return 'My Watchlist'
  return 'Explore'
})

// SAFE DATA LOADING
const loadData = async () => {
  loading.value = true
  content.value = [] 
  
  try {
    let response;

    // 1. Determine Endpoint based on Route
    if (route.path.includes('tv-shows')) {
      // Try TV endpoints, fallback to popular generic if undefined
      response = typeof MovieAPI.getTVShows === 'function' ? await MovieAPI.getTVShows() 
               : typeof MovieAPI.fetchTrendingTV === 'function' ? await MovieAPI.fetchTrendingTV()
               : await MovieAPI.getPopular(); 
    } 
    else if (route.path.includes('movies')) {
      response = typeof MovieAPI.getMovies === 'function' ? await MovieAPI.getMovies()
               : await MovieAPI.getPopular();
    } 
    else if (route.path.includes('new-popular')) {
      response = await MovieAPI.fetchTrending();
    } 
    else {
      // Default / Home fallback
      response = await MovieAPI.getPopular();
    }

    // 2. Handle Data Structure (TMDB usually returns { results: [] })
    const items = response.results || response || []
    
    // 3. Filter valid items (Must have an image)
    content.value = items.filter(i => i.poster_path || i.backdrop_path)

  } catch (error) {
    console.error(`Error loading ${pageTitle.value}:`, error)
    // Last resort fallback so screen isn't empty on error
    try {
      const fallback = await MovieAPI.getPopular()
      content.value = (fallback.results || fallback).slice(0, 10)
    } catch (e) { /* Silent fail */ }
  } finally {
    loading.value = false
  }
}

const openModal = (movie) => selectedMovie.value = movie

watch(() => route.path, loadData, { immediate: true })
</script>