<template>
  <div class="fixed inset-0 z-[9999] bg-black flex flex-col animate-fade-in">
    
    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row items-center justify-between p-4 z-20 bg-[#141414] border-b border-gray-800 gap-4">
      
      <!-- Back Button & Title -->
      <div class="flex items-center gap-4 w-full md:w-auto">
        <button @click="closePlayer" class="text-white hover:text-red-500 transition flex items-center gap-2">
          <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 class="text-white font-bold text-sm md:text-lg truncate max-w-[200px] md:max-w-md">
          {{ movie.title || movie.name }}
        </h2>
      </div>

      <!-- Controls (Server & Mode) -->
      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        
        <!-- Server Switcher (Only show for Full Movie) -->
        <select 
          v-if="mode === 'full'"
          v-model="activeServer" 
          class="bg-gray-800 text-white text-xs md:text-sm px-3 py-1.5 rounded border border-gray-600 focus:border-green-500 outline-none"
        >
          <option v-for="(url, name) in servers" :key="name" :value="name">
            Source: {{ name }}
          </option>
        </select>

        <!-- Watch Party Button -->
        <button 
          v-if="mode === 'full'"
          @click="showWatchPartyModal = true"
          class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm px-3 py-1.5 rounded font-bold transition"
        >
          {{ isInWatchParty ? '👥 In Party' : '🎬 Watch Party' }}
        </button>

        <!-- Mode Toggle -->
        <div class="flex bg-gray-800 rounded-full p-1 gap-1">
          <button 
            @click="mode = 'trailer'"
            :class="['px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-bold transition', mode === 'trailer' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white']"
          >
            Trailer
          </button>
          <button 
            @click="mode = 'full'"
            :class="['px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-bold transition', mode === 'full' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white']"
          >
            Movie
          </button>
        </div>
      </div>
    </div>

    <!-- Content Area with Chat Sidebar -->
    <div class="flex-1 relative w-full h-full bg-black overflow-hidden">
      
      <!-- Main Video Area -->
      <div :class="['transition-all duration-300', isInWatchParty ? 'md:w-3/4' : 'w-full']">
        
        <!-- LOADING SPINNER -->
        <div class="absolute inset-0 flex items-center justify-center z-0">
          <div class="flex flex-col items-center gap-4">
            <div class="animate-spin h-10 w-10 md:h-12 md:w-12 border-4 border-gray-600 border-t-green-500 rounded-full"></div>
            <p v-if="mode === 'full'" class="text-gray-500 text-xs md:text-sm">Connecting to {{ activeServer }}...</p>
          </div>
        </div>

        <!-- TRAILER (YouTube) -->
        <div v-if="mode === 'trailer'" class="absolute inset-0 z-10 bg-black">
          <iframe 
            v-if="trailerKey"
            :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`"
            class="w-full h-full"
            frameborder="0"
            allow="autoplay; encrypted-media; fullscreen"
          ></iframe>
          <div v-else class="flex flex-col items-center justify-center h-full text-gray-500 px-4 text-center">
            <p class="text-xl font-bold mb-2">Trailer Unavailable</p>
            <button @click="mode = 'full'" class="text-green-500 hover:underline">Switch to Full Movie</button>
          </div>
        </div>

        <!-- FULL MOVIE (Embed Source) -->
        <div v-if="mode === 'full'" class="absolute inset-0 z-10 bg-black">
          <iframe 
            :key="activeServer"
            :src="currentSourceUrl"
            class="w-full h-full"
            frameborder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <!-- Watch Party Chat (Mobile: Hidden, Desktop: Sidebar) -->
      <div v-if="isInWatchParty" class="hidden md:flex md:w-1/4 border-l border-gray-800">
        <WatchPartyChat 
          :is-active-party="isInWatchParty"
          :party-id="watchPartyState.party.id"
          :room-code="watchPartyState.party.roomCode"
          :participants="watchPartyState.party.participants"
          @close="leaveWatchParty"
        />
      </div>
    </div>

    <!-- Watch Party Modal -->
    <WatchPartyModal 
      :is-open="showWatchPartyModal"
      :movie-id="movie.id"
      :movie-title="movie.title || movie.name"
      @close="showWatchPartyModal = false"
      @party-created="handlePartyCreated"
      @party-joined="handlePartyJoined"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, reactive } from 'vue'
import { MovieAPI } from '@/services/api'
import WatchPartyModal from './WatchPartyModal.vue'
import WatchPartyChat from './WatchPartyChat.vue'
import { useWatchPartySync } from '@/composables/useWatchPartySync'

const props = defineProps(['movie', 'initialMode'])
const emit = defineEmits(['close'])

const mode = ref(props.initialMode || 'full')
const trailerKey = ref(null)
const activeServer = ref('VidSrc')

// Watch Party State
const showWatchPartyModal = ref(false)
const isInWatchParty = ref(false)
const watchPartyState = reactive({
  party: {
    id: null,
    roomCode: null,
    movieId: null,
    isHost: false,
    currentTime: 0,
    isPlaying: false,
    participants: []
  }
})

// Use sync composable
const syncManager = useWatchPartySync()

// Server List (Fallbacks if one doesn't work)
const servers = {
  'VidSrc': 'https://vidsrc.xyz/embed',
  'SuperEmbed': 'https://multiembed.mov/directstream.php?video_id=',
  '2Embed': 'https://www.2embed.cc/embed',
  'Smashy': 'https://embed.smashystream.com/playere.php?tmdb='
}

const currentSourceUrl = computed(() => {
  const id = props.movie.id
  const isTV = props.movie.name || props.movie.first_air_date || props.movie.number_of_seasons
  const baseUrl = servers[activeServer.value]

  // Different URL structures for different providers
  if (activeServer.value === 'VidSrc') {
    return isTV ? `${baseUrl}/tv/${id}` : `${baseUrl}/movie/${id}`
  }
  
  if (activeServer.value === '2Embed') {
    return isTV ? `${baseUrl}tv/${id}&s=1&e=1` : `${baseUrl}/${id}`
  }

  // Default structure
  return isTV ? `${baseUrl}${id}&s=1&e=1` : `${baseUrl}${id}`
})

const closePlayer = async () => {
  if (isInWatchParty.value) {
    await leaveWatchParty()
  }
  emit('close')
}

const handlePartyCreated = (data) => {
  isInWatchParty.value = true
  watchPartyState.party = {
    id: data.id,
    roomCode: data.roomCode,
    movieId: data.movieId,
    isHost: true,
    currentTime: 0,
    isPlaying: false,
    participants: [{ id: data.creator_id, name: 'You (Host)', isHost: true }]
  }
  
  syncManager.initializeParty({
    id: data.id,
    roomCode: data.roomCode,
    movieId: data.movieId,
    isHost: true,
    currentTime: 0,
    isPlaying: false,
    participants: watchPartyState.party.participants
  })
  
  syncManager.startSync()
}

const handlePartyJoined = (data) => {
  isInWatchParty.value = true
  watchPartyState.party = {
    id: data.id,
    roomCode: data.roomCode,
    movieId: data.movieId,
    isHost: data.isHost || false,
    currentTime: data.currentTime || 0,
    isPlaying: data.isPlaying || false,
    participants: data.participants || []
  }
  
  syncManager.initializeParty({
    id: data.id,
    roomCode: data.roomCode,
    movieId: data.movieId,
    isHost: data.isHost || false,
    currentTime: data.currentTime || 0,
    isPlaying: data.isPlaying || false,
    participants: data.participants || []
  })
  
  syncManager.startSync()
}

const leaveWatchParty = async () => {
  syncManager.stopSync()
  await syncManager.leaveParty()
  isInWatchParty.value = false
  watchPartyState.party.id = null
}

onMounted(async () => {
  try {
    const videos = await MovieAPI.getMovieVideos(props.movie.id)
    const trailer = videos.find(v => v.type === 'Trailer') || videos[0]
    if (trailer) trailerKey.value = trailer.key
  } catch (e) {
    console.warn('Trailer fetch failed', e)
  }
})

onBeforeUnmount(() => {
  if (isInWatchParty.value) {
    syncManager.stopSync()
  }
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>