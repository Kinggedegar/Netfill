<template>
  <div :class="isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'" class="w-full pt-8 px-4 flex justify-center animate-fade-in">
    <div class="w-full max-w-2xl">
      
      <!-- Header -->
      <div :class="isDarkMode ? 'border-gray-800' : 'border-gray-200'" class="mb-8 border-b pb-4">
        <h1 class="text-3xl md:text-4xl font-bold">My Profile</h1>
        <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-2">Manage your account information</p>
      </div>

      <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'" class="backdrop-blur-sm p-6 md:p-8 rounded-xl border shadow-lg space-y-8">
        
        <!-- PROFILE PICTURE SECTION -->
        <div class="flex flex-col items-center">
          <div class="relative group cursor-pointer w-32 h-32 mb-4" @click="triggerFileInput">
            
            <img 
              :src="previewImage || 'https://via.placeholder.com/200?text=Profile'"
              class="w-full h-full rounded-full object-cover border-4 transition duration-300 shadow-lg"
              :class="isDarkMode ? 'border-gray-700 group-hover:border-red-600' : 'border-gray-300 group-hover:border-red-500'"
              alt="Profile Picture"
            />
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <div class="text-center">
                <svg class="w-8 h-8 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span class="text-xs font-bold uppercase">Change</span>
              </div>
            </div>
          </div>
          
          <p :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" class="text-xs">JPG or PNG. Max 5MB.</p>
          
          <!-- Hidden File Input -->
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept="image/*"
            @change="handleFileChange"
          />
        </div>

        <!-- USER INFO SECTION -->
        <div class="border-t" :class="isDarkMode ? 'border-gray-800' : 'border-gray-200'">
          <h2 class="text-2xl font-bold mt-6 mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Account Information
          </h2>

          <div class="space-y-4">
            <div>
              <label :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-bold mb-2">Username</label>
              <input 
                v-model="username" 
                type="text" 
                placeholder="Enter your username"
                :class="isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition"
              />
            </div>

            <div>
              <label :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-bold mb-2">Email</label>
              <input 
                v-model="email" 
                type="email" 
                placeholder="Enter your email"
                disabled
                :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500'"
                class="w-full px-4 py-2 border rounded-lg opacity-60 cursor-not-allowed"
              />
              <p :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'" class="text-xs mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-bold mb-2">Member Since</label>
              <input 
                type="text" 
                :value="memberSince"
                disabled
                :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500'"
                class="w-full px-4 py-2 border rounded-lg opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <!-- SECURITY SECTION -->
        <div class="border-t" :class="isDarkMode ? 'border-gray-800' : 'border-gray-200'">
          <h2 class="text-2xl font-bold mt-6 mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Security
          </h2>

          <div class="space-y-3">
            <button @click="openChangePassword" :class="isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'" class="w-full p-3 rounded-lg text-left font-semibold transition">
              Change Password
            </button>
            <button @click="showDevices = !showDevices" :class="isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'" class="w-full p-3 rounded-lg text-left font-semibold transition">
              Manage Devices
            </button>
          </div>

          <!-- Devices List -->
          <div v-if="showDevices" class="mt-4 space-y-2">
            <div :class="isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'" class="p-4 rounded-lg flex items-center justify-between">
              <div>
                <p class="font-semibold">Current Device</p>
                <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Last active: Now</p>
              </div>
              <span class="text-green-500 font-bold">Active</span>
            </div>
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div :class="isDarkMode ? 'border-gray-800' : 'border-gray-200'" class="border-t pt-6 flex gap-4">
          <button
            @click="saveProfile"
            class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
          >
            Save Changes
          </button>
          <button
            @click="logout"
            :class="isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'"
            class="flex-1 py-3 font-bold rounded-lg transition"
          >
            Logout
          </button>
        </div>

        <!-- Delete Account -->
        <button
          @click="showDeleteConfirm = true"
          class="w-full py-3 bg-red-900/30 hover:bg-red-900/50 text-red-500 font-bold rounded-lg transition border border-red-500/30"
        >
          Delete Account
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div :class="isDarkMode ? 'bg-gray-900' : 'bg-white'" class="p-6 rounded-lg max-w-md mx-4">
        <h3 class="text-xl font-bold mb-4">Delete Account?</h3>
        <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
        <div class="flex gap-3">
          <button
            @click="showDeleteConfirm = false"
            :class="isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'"
            class="flex-1 py-2 rounded-lg font-bold transition"
          >
            Cancel
          </button>
          <button
            @click="deleteAccount"
            class="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)

const username = ref('')
const email = ref('')
const memberSince = ref('')
const previewImage = ref('')
const showDevices = ref(false)
const showDeleteConfirm = ref(false)

const isDarkMode = computed(() => {
  const theme = localStorage.getItem('theme') || 'dark'
  if (theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return theme !== 'light'
})

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  username.value = user.username || 'User'
  email.value = user.email || ''
  memberSince.value = new Date().toLocaleDateString()
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target?.result
      localStorage.setItem('userAvatar', previewImage.value)
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  user.username = username.value
  user.avatar = previewImage.value
  localStorage.setItem('user', JSON.stringify(user))
  alert('Profile updated successfully!')
}

const openChangePassword = () => {
  alert('Change password feature coming soon!')
}

const deleteAccount = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')
  showDeleteConfirm.value = false
  router.push('/signin')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')
  router.push('/signin')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
