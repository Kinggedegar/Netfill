<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative flex items-center justify-center overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Header -->
    <div class="absolute top-0 left-0 p-6 z-20">
      <router-link to="/" class="text-3xl font-bold text-red-600 flex items-center gap-2 hover:scale-105 transition">
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z"/>
        </svg>
        Netfill
      </router-link>
    </div>

    <!-- Form Container -->
    <div class="relative z-10 w-full max-w-md mx-4 px-6">
      <div class="bg-black/80 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold mb-2 text-white">Sign In</h1>
            <p class="text-gray-400">Welcome back to your entertainment</p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span class="text-xs font-semibold text-gray-400">Account Type:</span>
            <div class="flex gap-2">
              <button 
                type="button"
                @click="accountType = 'user'"
                :class="accountType === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                class="px-3 py-1 rounded text-xs font-semibold transition"
              >
                User
              </button>
              <button 
                type="button"
                @click="accountType = 'admin'"
                :class="accountType === 'admin' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                class="px-3 py-1 rounded text-xs font-semibold transition"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        <!-- Type Indicator Banner -->
        <div v-if="accountType === 'admin'" class="mb-6 p-3 bg-red-600/20 border border-red-600 rounded-lg text-red-200 text-sm flex items-center gap-2">
          <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M2.166 4.999a11.954 11.954 0 0010.232 12.387c.5.905.852 1.283 1.349 1.606.342.229.694.4 1.053.545.823.281 1.687-.212 1.687-1.12V4.718c0-.909-.864-1.4-1.687-1.12a2.236 2.236 0 00-1.053.545c-.457.323-.81.701-1.349 1.606A11.954 11.954 0 002.166 4.999z" clip-rule="evenodd" />
          </svg>
          <span>You are signing in as an <strong>Administrator</strong></span>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
          {{ error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSignIn" class="space-y-5">
          <!-- Email Input -->
          <div class="relative group">
            <input
              v-model="email"
              type="email"
              required
              placeholder=" "
              class="block w-full px-5 pt-6 pb-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-600 focus:bg-gray-700 focus:outline-none transition peer"
            />
            <label class="absolute text-gray-400 text-sm duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Email Address
            </label>
          </div>

          <!-- Password Input -->
          <div class="relative group">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder=" "
              class="block w-full px-5 pt-6 pb-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-600 focus:bg-gray-700 focus:outline-none transition peer"
            />
            <label class="absolute text-gray-400 text-sm duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Password
            </label>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-4 text-gray-400 hover:text-white transition"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM19.364 5.364l-1.414 1.414M9.172 9.172L7.757 7.757m3.536 9.172l1.414 1.414M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </button>
          </div>

          <!-- Remember Me & Help -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 text-gray-400 hover:text-white transition cursor-pointer">
              <input type="checkbox" v-model="rememberMe" class="w-4 h-4 bg-gray-800 border border-gray-700 rounded cursor-pointer accent-red-600" />
              Remember me
            </label>
            <a href="#" class="text-gray-400 hover:text-red-600 transition">Need help?</a>
          </div>

          <!-- Sign In Button -->
          <button
            :disabled="loading"
            type="submit"
            class="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition duration-300 transform hover:scale-105 disabled:scale-100 mt-8"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else class="flex items-center justify-center gap-2">
              <span class="inline-block w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></span>
              Signing in...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center">
          <div class="flex-grow border-t border-gray-700"></div>
          <span class="px-4 text-gray-500 text-sm">OR</span>
          <div class="flex-grow border-t border-gray-700"></div>
        </div>

        <!-- Sign Up Link -->
        <p class="text-center text-gray-400">
          New to Netfill?
          <router-link to="/signup" class="text-white font-semibold hover:text-red-600 transition">
            Sign up now
          </router-link>
        </p>
      </div>

      <!-- Footer Note -->
      <p class="text-center text-gray-500 text-xs mt-6">
        This page is protected by Google reCAPTCHA and the Google<br />
        <a href="#" class="hover:text-white">Privacy Policy</a> and
        <a href="#" class="hover:text-white">Terms of Service</a> apply.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AuthAPI } from '@/services/backend-api.js'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')
const accountType = ref('user')

const handleSignIn = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('Attempting sign in with:', email.value)
    const response = await AuthAPI.signin(email.value, password.value)
    
    console.log('Sign in response:', response)

    // Store token and user info
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    localStorage.setItem('userName', response.user.username)
    localStorage.setItem('userRole', response.user.role || 'user')
    localStorage.setItem('isLoggedIn', 'true')

    console.log('User role:', response.user.role)

    // Track login
    try {
      const device = navigator.userAgent.includes('Chrome') ? 'Chrome' 
                    : navigator.userAgent.includes('Firefox') ? 'Firefox'
                    : navigator.userAgent.includes('Safari') ? 'Safari'
                    : 'Unknown'
      await fetch('http://localhost:5000/api/admin/track-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${response.token}`
        },
        body: JSON.stringify({ device })
      })
    } catch (trackingErr) {
      console.log('Could not track login:', trackingErr)
    }

    // Redirect based on role
    let nextPath = route.query.redirect || '/'
    
    // If admin, redirect to admin dashboard
    if (response.user.role === 'admin') {
      nextPath = '/admin'
      console.log('Admin detected, redirecting to:', nextPath)
    } else {
      console.log('User detected, redirecting to:', nextPath)
    }
    
    router.push(nextPath)
  } catch (err) {
    console.error('Sign in error:', err)
    error.value = err.message || 'Failed to sign in. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>