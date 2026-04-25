<template>
  <div v-if="isActiveParty" :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="border-l h-full flex flex-col">
    <!-- Header -->
    <div :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'" class="border-b p-4 flex-shrink-0">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-lg">👥 Watch Party</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 p-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Room Code -->
      <div class="flex items-center gap-2">
        <span :class="isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded text-xs font-mono font-bold">
          {{ roomCode }}
        </span>
        <button @click="copyRoomCode" class="text-xs opacity-50 hover:opacity-100 transition">
          📋 Copy
        </button>
      </div>
    </div>

    <!-- Participants List -->
    <div :class="isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'" class="border-b p-4 flex-shrink-0">
      <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs font-semibold mb-2 uppercase">
        Watching ({{ participants.length }})
      </p>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="participant in participants" 
          :key="participant.id"
          :class="isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white border border-gray-200'"
          class="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full" :class="participant.isHost ? 'bg-yellow-500' : 'bg-green-500'"></span>
          {{ participant.name }}
          <span v-if="participant.isHost" class="text-yellow-500">👑</span>
        </div>
      </div>
    </div>

    <!-- Messages Container -->
    <div ref="messagesContainer" :class="isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'" class="flex-1 overflow-y-auto p-4 space-y-3">
      <div v-if="messages.length === 0" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" class="text-center py-8 text-sm">
        👋 No messages yet. Say something!
      </div>
      
      <div 
        v-for="msg in messages" 
        :key="msg.id"
        class="text-sm"
      >
        <!-- Chat Message -->
        <div v-if="msg.type === 'chat'" :class="isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'" class="p-2 rounded">
          <p :class="isDarkMode ? 'text-blue-400' : 'text-blue-700'" class="font-semibold text-xs">
            {{ msg.username }}
          </p>
          <p :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'" class="text-sm break-words">
            {{ msg.content }}
          </p>
        </div>

        <!-- Reaction -->
        <div v-else-if="msg.type === 'reaction'" class="mt-1 flex items-center gap-1 animate-bounce">
          <span class="text-2xl">{{ msg.content }}</span>
          <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs font-semibold">
            {{ msg.username }}
          </span>
        </div>
      </div>
    </div>

    <!-- Reaction Buttons -->
    <div :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'" class="border-t p-3 flex-shrink-0">
      <div class="flex gap-1 mb-3 justify-center">
        <button
          v-for="emoji in reactionEmojis"
          :key="emoji"
          @click="sendReaction(emoji)"
          class="text-2xl hover:scale-125 transition"
        >
          {{ emoji }}
        </button>
      </div>
    </div>

    <!-- Message Input -->
    <div :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-t p-3 flex-shrink-0">
      <form @submit.prevent="sendMessage" class="flex gap-2">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="Say something..."
          :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'"
          class="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <button
          type="submit"
          :disabled="!inputMessage.trim()"
          :class="inputMessage.trim() ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'"
          class="px-3 py-2 bg-red-600 text-white rounded-lg font-semibold transition text-sm"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
  isActiveParty: {
    type: Boolean,
    default: false
  },
  partyId: {
    type: String,
    default: null
  },
  roomCode: {
    type: String,
    default: ''
  },
  participants: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'message-sent'])

const messages = ref([])
const inputMessage = ref('')
const messagesContainer = ref(null)
const reactionEmojis = ['😂', '🔥', '❤️', '👍', '😍', '🎉']
const messageCheckInterval = ref(null)

const isDarkMode = computed(() => {
  const theme = localStorage.getItem('theme') || 'dark'
  return theme !== 'light'
})

const copyRoomCode = () => {
  navigator.clipboard.writeText(props.roomCode)
  alert('Room code copied to clipboard!')
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const loadMessages = async () => {
  if (!props.partyId) return

  try {
    const response = await fetch(`http://localhost:5000/api/watch-party/party/${props.partyId}/messages`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      messages.value = data.messages || []
      await scrollToBottom()
    }
  } catch (err) {
    console.error('Failed to load messages:', err)
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  const messageText = inputMessage.value
  inputMessage.value = ''

  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:5000/api/watch-party/party/${props.partyId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type: 'chat',
        content: messageText
      })
    })

    if (response.ok) {
      emit('message-sent', { type: 'chat', content: messageText })
      await loadMessages()
    }
  } catch (err) {
    console.error('Failed to send message:', err)
    inputMessage.value = messageText
  }
}

const sendReaction = async (emoji) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:5000/api/watch-party/party/${props.partyId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type: 'reaction',
        content: emoji
      })
    })

    if (response.ok) {
      emit('message-sent', { type: 'reaction', content: emoji })
      await loadMessages()
    }
  } catch (err) {
    console.error('Failed to send reaction:', err)
  }
}

watch(() => props.isActiveParty, async (newVal) => {
  if (newVal) {
    messages.value = []
    await loadMessages()
    // Poll for new messages every 2 seconds
    messageCheckInterval.value = setInterval(loadMessages, 2000)
  } else {
    if (messageCheckInterval.value) {
      clearInterval(messageCheckInterval.value)
    }
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (messageCheckInterval.value) {
    clearInterval(messageCheckInterval.value)
  }
})
</script>

<style scoped>
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.animate-bounce {
  animation: bounce 0.6s ease-in-out;
}
</style>
