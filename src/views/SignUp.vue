<template>
  <div class="min-h-screen relative flex items-center justify-center bg-[#121212] py-20 px-4">
    <!-- Simple Header for Sign Up -->
    <div class="absolute top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-20">
      <!-- <router-link to="/" class="text-2xl md:text-3xl font-black text-white tracking-tighter">
        Net<span class="text-[#F5C518]">Fill</span>
      </router-link> -->
      <router-link to="/login" class="text-white font-medium hover:underline">Sign In</router-link>
    </div>

    <!-- Register Container -->
    <div class="w-full max-w-lg bg-black/40 p-8 md:p-12 rounded-xl border border-gray-800">
      <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
      <p class="text-gray-400 mb-8">Start your VIP membership today.</p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        
        <!-- Name -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-300">Full Name</label>
          <input 
            type="text" 
            required
            class="w-full bg-[#2A2A2A] border border-gray-700 rounded p-3 text-white focus:border-[#F5C518] focus:outline-none transition"
            placeholder="John Doe"
          />
        </div>

        <!-- Email -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-300">Email Address</label>
          <input 
            type="email" 
            required
            class="w-full bg-[#2A2A2A] border border-gray-700 rounded p-3 text-white focus:border-[#F5C518] focus:outline-none transition"
            placeholder="name@example.com"
          />
        </div>

        <!-- Password -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-300">Password</label>
          <input 
            type="password" 
            required
            class="w-full bg-[#2A2A2A] border border-gray-700 rounded p-3 text-white focus:border-[#F5C518] focus:outline-none transition"
            placeholder="Create a password"
          />
        </div>

        <!-- Plan Selection (Visual only) -->
        <div class="pt-4 pb-2">
          <div class="p-4 border border-[#F5C518] bg-[#F5C518]/10 rounded flex justify-between items-center cursor-pointer">
            <div>
              <p class="text-[#F5C518] font-bold">VIP Premium</p>
              <p class="text-xs text-gray-300">4K Quality, No Ads</p>
            </div>
            <div class="w-5 h-5 rounded-full bg-[#F5C518] flex items-center justify-center">
              <svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-[#F5C518] hover:bg-[#d4a910] text-black font-bold py-3.5 rounded mt-4 transition"
        >
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
const loading = ref(false)

const handleRegister = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    router.push('/')
  }, 1500)
}
</script>