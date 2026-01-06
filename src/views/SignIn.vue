<template>
  <div class="min-h-screen relative flex items-center justify-center bg-black overflow-hidden">
    <!-- Cinematic Background -->
    <div class="absolute inset-0 z-0">
      <img 
        src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg" 
        alt="Background" 
        class="w-full h-full object-cover opacity-50 scale-105"
      />
      <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
    </div>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-md px-6">
      <div class="bg-black/75 backdrop-blur-md p-8 md:p-12 rounded-lg border border-gray-800 shadow-2xl">
        <h2 class="text-3xl font-bold text-white mb-8">Sign In</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div class="relative group">
            <input 
              v-model="email"
              type="email" 
              required
              class="block w-full px-4 py-3.5 bg-[#333] text-white rounded focus:outline-none focus:bg-[#454545] focus:ring-2 focus:ring-[#F5C518] peer placeholder-transparent transition-all"
              id="email"
              placeholder="Email"
            />
            <label 
              for="email" 
              class="absolute left-4 top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#F5C518] peer-valid:-top-2 peer-valid:text-xs"
            >
              Email or phone number
            </label>
          </div>

          <!-- Password -->
          <div class="relative group">
            <input 
              v-model="password"
              type="password" 
              required
              class="block w-full px-4 py-3.5 bg-[#333] text-white rounded focus:outline-none focus:bg-[#454545] focus:ring-2 focus:ring-[#F5C518] peer placeholder-transparent transition-all"
              id="password"
              placeholder="Password"
            />
            <label 
              for="password" 
              class="absolute left-4 top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#F5C518] peer-valid:-top-2 peer-valid:text-xs"
            >
              Password
            </label>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-[#F5C518] hover:bg-[#e0b115] text-black font-bold py-3.5 rounded transition transform active:scale-95 flex items-center justify-center"
          >
            <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-t-2 border-black mr-2"></span>
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>

          <!-- Helper Links -->
          <div class="flex items-center justify-between text-sm text-gray-400 mt-2">
            <label class="flex items-center gap-2 cursor-pointer hover:text-white">
              <input type="checkbox" class="rounded bg-[#333] border-none focus:ring-[#F5C518] text-[#F5C518]">
              Remember me
            </label>
            <a href="#" class="hover:underline hover:text-white">Need help?</a>
          </div>
        </form>

        <div class="mt-10 text-gray-400 text-base">
          New to MovieBox? 
          <router-link to="/register" class="text-white hover:underline font-medium ml-1">Sign up now.</router-link>
        </div>
        
        <div class="mt-4 text-xs text-gray-500">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = () => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    // Simulate successful login -> Redirect Home
    router.push('/')
  }, 1500)
}
</script>