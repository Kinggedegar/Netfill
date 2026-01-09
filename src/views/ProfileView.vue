<template>
  <div class="min-h-screen bg-[#141414] text-white flex items-center justify-center pt-24 pb-10 px-4 animate-fade-in">
    <div class="w-full max-w-2xl">
      
      <h1 class="text-4xl md:text-5xl font-bold mb-8 border-b border-[#333] pb-4">Edit Profile</h1>

      <div class="flex flex-col md:flex-row gap-8">
        
        <!-- Left: Current Avatar Preview -->
        <div class="flex-shrink-0 flex flex-col items-center gap-4">
          <div class="relative w-32 h-32 md:w-40 md:h-40 rounded overflow-hidden shadow-lg">
            <img :src="profileData.avatar" class="w-full h-full object-cover" />
            <div class="absolute inset-0 ring-1 ring-inset ring-white/10"></div>
          </div>
        </div>

        <!-- Right: Edit Form -->
        <div class="flex-1 space-y-6">
          
          <!-- Name Input -->
          <div class="space-y-2">
            <label class="bg-[#333] text-gray-200 px-4 py-2 text-xs uppercase font-bold tracking-widest block w-full rounded-t">
              Profile Name
            </label>
            <input 
              v-model="profileData.name"
              type="text" 
              class="w-full bg-[#141414] border border-gray-600 px-4 py-3 text-white text-lg focus:outline-none focus:border-white transition"
            />
          </div>

          <!-- Avatar Selection -->
          <div class="space-y-3">
            <p class="text-gray-400 text-sm">Choose an Icon:</p>
            <div class="grid grid-cols-4 sm:grid-cols-5 gap-3">
              <button 
                v-for="(icon, index) in avatars" 
                :key="index"
                @click="profileData.avatar = icon"
                class="relative rounded overflow-hidden transition-transform hover:scale-110 border-2 aspect-square group"
                :class="profileData.avatar === icon ? 'border-white' : 'border-transparent'"
              >
                <img :src="icon" class="w-full h-full object-cover" />
                <div v-if="profileData.avatar === icon" class="absolute inset-0 bg-black/20"></div>
              </button>
            </div>
          </div>

          <!-- Language (Visual Only) -->
          <div class="space-y-2 pt-4 border-t border-[#333]">
            <h3 class="text-lg font-medium text-gray-300">Language</h3>
            <select class="bg-black border border-white/30 text-white px-3 py-1 rounded">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-4 pt-6 mt-6 border-t border-[#333]">
            <button 
              @click="saveProfile"
              class="bg-white text-black px-8 py-2 font-bold hover:bg-red-600 hover:text-white transition tracking-wide text-lg rounded-sm"
            >
              SAVE
            </button>
            <button 
              @click="$router.push('/')"
              class="border border-gray-500 text-gray-500 px-8 py-2 font-bold hover:border-white hover:text-white transition tracking-wide text-lg rounded-sm"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Netflix-style Avatar Presets
const avatars = [
  'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
  'https://mir-s3-cdn-cf.behance.net/project_modules/disp/84c20033850498.56ba69ac290ea.png',
  'https://mir-s3-cdn-cf.behance.net/project_modules/disp/64623a33850498.56ba69ac2a6f7.png',
  'https://mir-s3-cdn-cf.behance.net/project_modules/disp/bf6e4a33850498.56ba69ac3064f.png',
  'https://mir-s3-cdn-cf.behance.net/project_modules/disp/e70b1333850498.56ba69ac32e3b.png',
]

const profileData = ref({
  name: 'User',
  avatar: avatars[0]
})

onMounted(() => {
  // Load current data
  const storedName = localStorage.getItem('userName')
  const storedAvatar = localStorage.getItem('userAvatar')
  
  if (storedName) profileData.value.name = storedName
  if (storedAvatar) profileData.value.avatar = storedAvatar
})

const saveProfile = () => {
  // Save to storage
  localStorage.setItem('userName', profileData.value.name)
  localStorage.setItem('userAvatar', profileData.value.avatar)
  
  // Force reload to home so Navbar updates
  window.location.href = '/'
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>