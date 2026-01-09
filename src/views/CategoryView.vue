<template>
  <div class="min-h-screen bg-[#141414] pt-24 px-4 md:px-12 pb-12">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-white capitalize">
        {{ pageTitle }}
      </h1>
      
      <!-- Filters -->
      <div v-if="!isWatchlist" class="flex gap-4">
        <select 
          v-model="selectedGenre" 
          @change="fetchData"
          class="bg-black border border-gray-600 text-white py-1 px-3 rounded focus:outline-none focus:border-white"
        >
          <option value="">All Genres</option>
          <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
        </select>
        
        <select 
          v-model="sortBy"
          class="bg-black border border-gray-600 text-white py-1 px-3 rounded focus:outline-none focus:border-white"
        >
          <option value="popularity">Popular</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600"></div>
    </div>

    <!-- Grid -->
    <div v-else-if="items.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
      <div 
        v-for="item in items" 
        :key="item.id"
        @click="$router.push(`/movie/${item.id}`)"
        class="group cursor-pointer flex flex-col gap-2"
      >
        <div class="relative aspect-[2/3] rounded bg-gray-800 overflow-hidden shadow-lg transition duration-300 group-hover:scale-105 group-hover:z-10 ring-0 group-hover:ring-2 ring-white">
          <img 
            :src="item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/300x450'" 
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <div class="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-bold px-1 rounded shadow">HD</div>
        </div>
        
        <div>
          <h3 class="text-white text-sm font-bold truncate group-hover:text-red-500 transition">{{ item.title || item.name }}</h3>
          <p class="text-gray-500 text-xs">{{ (item.release_date || item.first_air_date || '').split('-')[0] }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 text-gray-500">
      <p class="text-xl">No content found.</p>
      <router-link v-if="isWatchlist" to="/" class="text-white underline mt-2 block">Browse Content</router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { MovieAPI } from '@/services/api'

const route = useRoute()

const items = ref([])
const genres = ref([])
const loading = ref(true)
const selectedGenre = ref('')
const sortBy = ref('popularity')

const pageTitle = computed(() => {
  if (route.path.includes('tv-shows')) return 'TV Shows'
  if (route.path.includes('my-list')) return 'My List'
  return 'Movies'
})

const isWatchlist = computed(() => route.path.includes('my-list'))

// Fetch Genres
const loadGenres = async () => {
  try {
    const res = route.path.includes('tv') 
      ? await MovieAPI.getTVGenres() 
      : await MovieAPI.getMovieGenres()
    genres.value = res.genres
  } catch (e) { console.error(e) }
}

const fetchData = async () => {
  loading.value = true
  items.value = []

  try {
    if (isWatchlist.value) {
      items.value = JSON.parse(localStorage.getItem('watchlist') || '[]')
    } else {
      const isTV = route.path.includes('tv')
      let res
      
      if (selectedGenre.value) {
        res = isTV 
          ? await MovieAPI.getTVByGenre(selectedGenre.value)
          : await MovieAPI.getMoviesByGenre(selectedGenre.value)
      } else {
        res = isTV 
          ? await MovieAPI.getTVShows()
          : await MovieAPI.getMovies()
      }
      
      let list = res.results || res
      
      // Client-side Sort (Basic)
      if (sortBy.value === 'rating') {
        list.sort((a, b) => b.vote_average - a.vote_average)
      }
      
      items.value = list
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(() => route.path, () => {
  selectedGenre.value = ''
  loadGenres()
  fetchData()
})

watch(sortBy, fetchData)

onMounted(() => {
  if (!isWatchlist.value) loadGenres()
  fetchData()
})
</script>