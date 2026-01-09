<template>
  <div class="min-h-screen bg-[#141414] text-white pt-24 pb-20 animate-fade-in">
    <!-- Header -->
    <div class="px-4 md:px-12 lg:px-16 mb-8 flex items-end gap-4">
      <h1 class="text-3xl md:text-5xl font-black">My List</h1>
      <p class="text-gray-400 text-sm md:text-base pb-1 md:pb-2">
        {{ watchlist.length }} Titles
      </p>
    </div>

    <!-- Controls -->
    <div v-if="watchlist.length > 0" class="px-4 md:px-12 lg:px-16 mb-8 flex flex-wrap items-center justify-between gap-4">
      <div class="flex gap-6 border-b border-gray-800">
        <button v-for="opt in sortOptions" :key="opt.val" @click="sortBy = opt.val"
          class="pb-3 text-sm font-bold transition relative"
          :class="sortBy === opt.val ? 'text-white' : 'text-gray-500 hover:text-gray-300'"
        >
          {{ opt.label }}
          <span v-if="sortBy === opt.val" class="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
        </button>
      </div>
      
      <!-- View Toggle -->
      <div class="flex bg-gray-900 rounded p-1">
        <button @click="viewMode='grid'" class="p-2 rounded transition" :class="viewMode==='grid' ? 'bg-gray-700 text-white' : 'text-gray-500'">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/></svg>
        </button>
        <button @click="viewMode='list'" class="p-2 rounded transition" :class="viewMode==='list' ? 'bg-gray-700 text-white' : 'text-gray-500'">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="watchlist.length === 0" class="flex flex-col items-center justify-center py-40 text-center px-4">
      <div class="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      </div>
      <h2 class="text-xl md:text-2xl font-bold mb-2">Your list is empty</h2>
      <p class="text-gray-400 mb-8 max-w-sm">Add movies and TV shows to your list so you can easily find them later.</p>
      <router-link to="/" class="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition">
        Browse Content
      </router-link>
    </div>

    <!-- GRID VIEW -->
    <div v-else-if="viewMode === 'grid'" class="px-4 md:px-12 lg:px-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <div v-for="item in sortedList" :key="item.id" 
        class="group relative aspect-[2/3] bg-gray-800 rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 z-0 hover:z-10 shadow-lg"
        @click="goToMovie(item.id)"
      >
        <img :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`" class="w-full h-full object-cover" loading="lazy" />
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-3">
           <div class="flex justify-end">
             <button @click.stop="removeItem(item.id)" class="bg-black/50 hover:bg-red-600 p-1.5 rounded-full text-white transition">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
             </button>
           </div>
           <div>
             <div class="flex items-center gap-2 mb-1">
                <span class="text-green-500 text-xs font-bold">{{ Math.round(item.vote_average * 10) }}% Match</span>
             </div>
             <p class="text-xs font-semibold text-white line-clamp-2">{{ item.title || item.name }}</p>
           </div>
        </div>
      </div>
    </div>

    <!-- LIST VIEW -->
    <div v-else class="px-4 md:px-12 lg:px-16 space-y-4 max-w-5xl">
       <div v-for="item in sortedList" :key="item.id" 
          class="flex gap-4 bg-[#1f1f1f] p-4 rounded hover:bg-[#252525] transition group cursor-pointer"
          @click="goToMovie(item.id)"
       >
          <img :src="`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`" class="w-32 md:w-48 aspect-video object-cover rounded" />
          <div class="flex-1 flex flex-col justify-center">
             <h3 class="text-lg font-bold group-hover:text-red-500 transition">{{ item.title || item.name }}</h3>
             <div class="text-sm text-gray-400 mt-1 flex items-center gap-3">
               <span class="text-green-500 font-bold">{{ Math.round(item.vote_average * 10) }}% Match</span>
               <span>Added {{ formatDate(item.addedAt) }}</span>
             </div>
          </div>
          <button @click.stop="removeItem(item.id)" class="self-center p-2 text-gray-500 hover:text-white border border-gray-600 hover:border-white rounded-full transition">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const watchlist = ref([])
const sortBy = ref('recent')
const viewMode = ref('grid')

const sortOptions = [
  { label: 'Recently Added', val: 'recent' },
  { label: 'Title (A-Z)', val: 'title' },
  { label: 'Rating', val: 'rating' }
]

const loadWatchlist = () => {
  watchlist.value = JSON.parse(localStorage.getItem('watchlist') || '[]')
}

const sortedList = computed(() => {
  return [...watchlist.value].sort((a, b) => {
    if (sortBy.value === 'title') return (a.title || a.name).localeCompare(b.title || b.name)
    if (sortBy.value === 'rating') return b.vote_average - a.vote_average
    return b.addedAt - a.addedAt
  })
})

const removeItem = (id) => {
  watchlist.value = watchlist.value.filter(i => i.id !== id)
  localStorage.setItem('watchlist', JSON.stringify(watchlist.value))
}

const goToMovie = (id) => router.push(`/movie/${id}`)

const formatDate = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString()
}

onMounted(loadWatchlist)
</script>