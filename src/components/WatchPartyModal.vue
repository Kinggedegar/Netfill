<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="border rounded-2xl shadow-2xl max-w-md w-full">
      <!-- Header -->
      <div :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'" class="border-b sticky top-0 p-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold">{{ mode === 'create' ? '🎬 Start Watch Party' : '🎟️ Join Watch Party' }}</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-4">
        <!-- Mode Toggle -->
        <div class="flex gap-2 mb-6">
          <button 
            @click="mode = 'create'"
            :class="mode === 'create' 
              ? 'bg-red-600 text-white' 
              : (isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700')"
            class="flex-1 py-2 px-4 rounded-lg font-semibold transition"
          >
            Create
          </button>
          <button 
            @click="mode = 'join'"
            :class="mode === 'join' 
              ? 'bg-red-600 text-white' 
              : (isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700')"
            class="flex-1 py-2 px-4 rounded-lg font-semibold transition"
          >
            Join
          </button>
        </div>

        <!-- Create Mode -->
        <div v-if="mode === 'create'" class="space-y-4">
          <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
            Create a watch party for this movie and invite your friends!
          </p>
          <div class="p-4 rounded-lg" :class="isDarkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'">
            <p class="text-sm font-semibold">{{ movieTitle }}</p>
            <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs mt-1">You'll be the host and can control playback</p>
          </div>
          <button 
            @click="createParty"
            :disabled="loading"
            :class="loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'"
            class="w-full py-3 bg-red-600 text-white font-bold rounded-lg transition"
          >
            {{ loading ? 'Creating...' : '✨ Create Watch Party' }}
          </button>
        </div>

        <!-- Join Mode -->
        <div v-else class="space-y-4">
          <div>
            <label :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-semibold mb-2">
              Room Code
            </label>
            <input
              v-model="roomCode"
              type="text"
              placeholder="Enter 6-letter code"
              :class="isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'"
              class="w-full px-4 py-2 border rounded-lg uppercase"
              @keyup.enter="joinParty"
            />
          </div>

          <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs">
            Ask the party creator for their room code. Your friend should share it with you.
          </p>

          <button 
            @click="joinParty"
            :disabled="!roomCode || loading"
            :class="!roomCode || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'"
            class="w-full py-3 bg-green-600 text-white font-bold rounded-lg transition"
          >
            {{ loading ? 'Joining...' : '🎟️ Join Party' }}
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="success" class="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200 text-sm">
          {{ success }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  movieId: {
    type: Number,
    default: null
  },
  movieTitle: {
    type: String,
    default: 'Unknown Movie'
  }
})

const emit = defineEmits(['close', 'party-created', 'party-joined'])

const mode = ref('create')
const roomCode = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const isDarkMode = computed(() => {
  const theme = localStorage.getItem('theme') || 'dark'
  return theme !== 'light'
})

const createParty = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:5000/api/watch-party/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        movieId: props.movieId,
        title: props.movieTitle
      })
    })

    if (response.ok) {
      const data = await response.json()
      success.value = `✓ Party created! Code: ${data.roomCode}`
      emit('party-created', data)
      setTimeout(() => {
        emit('close')
      }, 1500)
    } else {
      const data = await response.json()
      error.value = data.error || 'Failed to create party'
    }
  } catch (err) {
    error.value = err.message || 'Failed to create party'
  } finally {
    loading.value = false
  }
}

const joinParty = async () => {
  if (!roomCode.value) {
    error.value = 'Please enter a room code'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:5000/api/watch-party/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        roomCode: roomCode.value
      })
    })

    if (response.ok) {
      const data = await response.json()
      success.value = `✓ Joined party!`
      emit('party-joined', data)
      setTimeout(() => {
        emit('close')
      }, 1500)
    } else {
      const data = await response.json()
      error.value = data.error || 'Failed to join party'
    }
  } catch (err) {
    error.value = err.message || 'Failed to join party'
  } finally {
    loading.value = false
  }
}
</script>
