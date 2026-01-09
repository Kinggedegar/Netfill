<template>
  <div class="min-h-screen bg-[#141414] text-white pt-24 px-4 md:px-12 pb-12 animate-fade-in">
    
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-32">
       <div class="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full"></div>
    </div>

    <!-- Results -->
    <div v-else>
      <div class="mb-6">
        <h1 class="text-2xl text-gray-400">
          Results for: <span class="text-white font-bold">"{{ query }}"</span>
        </h1>
      </div>

      <div v-if="results.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="item in results" :key="item.id" 
          class="group cursor-pointer flex flex-col gap-2"
          @click="handleClick(item)"
        >
          <!-- Image -->
          <div class="relative aspect-[2/3] bg-gray-800 rounded overflow-hidden">
            <img 
              :src="getImage(item)" 
              class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              @error="$event.target.src='https://via.placeholder.com/300x450?text=No+Image'"
            />
            
            <!-- Type Badge -->
            <div class="absolute top-2 left-2 bg-black/70 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded uppercase text-gray-300">
               {{ item.media_type === 'tv' ? 'Series' : item.media_type }}
            </div>

            <div v-if="item.vote_average" class="absolute top-2 right-2 bg-green-600 text-black text-[10px] font-bold px-1.5 rounded">
               {{ item.vote_average.toFixed(1) }}
            </div>
          </div>
          
          <!-- Text -->
          <div>
            <h3 class="font-bold text-sm truncate group-hover:text-red-500 transition">
              {{ item.title || item.name }}
            </h3>
            <p class="text-xs text-gray-500">
              {{ (item.release_date || item.first_air_date || '').split('-')[0] }}
            </p>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-20">
        <p class="text-gray-500 text-lg">No matches found for "{{ query }}".</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MovieAPI } from '@/services/api'

const route = useRoute()
const router = useRouter()
const results = ref([])
const loading = ref(false)

const query = computed(() => route.query.q || '')

const getImage = (item) => {
  // Actors use profile_path, Movies use poster_path
  const path = item.profile_path || item.poster_path
  if (!path) return 'https://via.placeholder.com/300x450?text=No+Image'
  return `https://image.tmdb.org/t/p/w500${path}`
}

const handleClick = (item) => {
  if (item.media_type === 'person') return // Optionally add person page later
  router.push(`/movie/${item.id}`)
}

const performSearch = async () => {
  if (!query.value) return
  loading.value = true
  try {
    const data = await MovieAPI.searchContent(query.value)
    // Filter out items without images for a cleaner look
    results.value = (data.results || []).filter(i => i.poster_path || i.profile_path)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(query, performSearch)
onMounted(performSearch)
</script>