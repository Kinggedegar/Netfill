<template>
  <div class="min-h-screen bg-[#141414] text-white pt-24 px-4 flex justify-center animate-fade-in">
    <div class="w-full max-w-lg">
      
      <h1 class="text-3xl md:text-4xl font-bold mb-8 text-center border-b border-gray-800 pb-4">
        Edit Profile
      </h1>

      <div class="bg-black/40 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-800 shadow-2xl">
        
        <!-- PHOTO UPLOAD SECTION -->
        <div class="flex flex-col items-center mb-8">
          <div class="relative group cursor-pointer w-32 h-32" @click="triggerFileInput">
            
            <!-- The Image Display -->
            <img 
              :src="previewImage" 
              class="w-full h-full rounded-md object-cover border-4 border-transparent group-hover:border-red-600 transition duration-300 shadow-lg"
              alt="Profile Preview"
            />
            
            <!-- Overlay Icon (Appears on Hover) -->
            <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 rounded-md">
              <div class="text-center">
                <svg class="w-8 h-8 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span class="text-xs font-bold uppercase tracking-wider">Change</span>
              </div>
            </div>
          </div>
          
          <p class="text-gray-500 text-xs mt-3">JPG, PNG or GIF. Max 5MB.</p>
          
          <!-- Hidden File Input -->
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept="image/*"
            @change="handleFileChange"
          />
        </div>

        <!-- FORM INPUTS -->
        <div class="space-y-6">
          <div>
            <label class="block text-gray-400 text-sm font-bold mb-2">Profile Name</label>
            <input 
              v-model="username" 
              type="text" 
              placeholder="Enter your name"
              class="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-[#404040] transition"
            />
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-6">
            <button 
              @click="saveProfile"
              class="flex-1 bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 hover:scale-105 transition transform duration-200 shadow-lg"
            >
              Save Changes
            </button>
            <button 
              @click="$router.push('/')"
              class="flex-1 bg-transparent border border-gray-600 text-gray-300 font-bold py-3 rounded hover:border-white hover:text-white transition duration-200"
            >
              Cancel
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
const fileInput = ref(null)

// Default avatar fallback
const defaultAvatar = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'

// State
const username = ref('')
const previewImage = ref(defaultAvatar)

// Load current data when page opens
onMounted(() => {
  username.value = localStorage.getItem('userName') || 'ChillUser'
  
  // Check if we have a custom photo saved
  const savedAvatar = localStorage.getItem('userAvatar')
  if (savedAvatar) {
    previewImage.value = savedAvatar
  }
})

// Trigger the hidden html input when clicking the image
const triggerFileInput = () => {
  fileInput.value.click()
}

// Handle the file selection and convert to Base64 string
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Optional: Check file size (e.g., limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too big! Please choose an image under 2MB.")
      return
    }

    // 1. Create a Reader
    const reader = new FileReader()
    
    // 2. Define what happens when reading finishes
    reader.onload = (e) => {
      // e.target.result is the Base64 string of the image
      previewImage.value = e.target.result
    }
    
    // 3. Start reading the file
    reader.readAsDataURL(file)
  }
}

// Save to Local Storage and Notify Header
const saveProfile = () => {
  if (!username.value.trim()) {
    alert("Please enter a name")
    return
  }

  localStorage.setItem('userName', username.value)
  localStorage.setItem('userAvatar', previewImage.value)
  
  // Dispatch custom event so NavBar.vue updates immediately without refresh
  window.dispatchEvent(new Event('profile-updated'))
  
  router.push('/')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>