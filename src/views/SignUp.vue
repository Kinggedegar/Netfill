<template>
  <div class="min-h-screen bg-black relative flex items-center justify-center">
    <div class="absolute inset-0">
      <img src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg" class="w-full h-full object-cover opacity-50" />
      <div class="absolute inset-0 bg-black/60"></div>
    </div>

    <div class="absolute top-0 left-0 p-6 z-20 flex justify-between w-full px-8">
       <router-link to="/" class="text-4xl font-black text-red-600 tracking-tighter">NETFILL</router-link>
       <router-link to="/login" class="text-white font-bold hover:underline mt-2">Sign In</router-link>
    </div>

    <div class="relative z-10 bg-black/75 p-12 rounded md:w-[450px] w-full mx-4">
      <h1 class="text-3xl font-bold mb-2">Sign Up</h1>
      <p class="text-gray-400 mb-6">It only takes a minute.</p>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="relative group">
          <input v-model="name" type="text" required placeholder=" " class="block px-5 pt-6 pb-2 w-full text-white bg-[#333] rounded focus:bg-[#454545] focus:outline-none peer" />
          <label class="absolute text-gray-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Full Name</label>
        </div>

        <div class="relative group">
          <input v-model="email" type="email" required placeholder=" " class="block px-5 pt-6 pb-2 w-full text-white bg-[#333] rounded focus:bg-[#454545] focus:outline-none peer" />
          <label class="absolute text-gray-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Email</label>
        </div>

        <div class="relative group">
          <input v-model="password" type="password" required minlength="6" placeholder=" " class="block px-5 pt-6 pb-2 w-full text-white bg-[#333] rounded focus:bg-[#454545] focus:outline-none peer" />
          <label class="absolute text-gray-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Password</label>
        </div>

        <button :disabled="loading" class="w-full bg-red-600 hover:bg-red-700 py-3.5 rounded font-bold mt-8 transition disabled:opacity-50">
           {{ loading ? 'Creating Account...' : 'Start Membership' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleRegister = () => {
  loading.value = true
  setTimeout(() => {
    // Save User Data
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userEmail', email.value)
    localStorage.setItem('userName', name.value) // Save the Name
    localStorage.setItem('userAvatar', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png') // Set Default Avatar
    
    router.push('/')
  }, 1000)
}
</script>