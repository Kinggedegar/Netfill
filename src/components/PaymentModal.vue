<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="border rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
      <!-- Header -->
      <div :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'" class="border-b sticky top-0 p-6 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">Upgrade to Premium</h2>
          <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-1">Unlock unlimited entertainment</p>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Plans Grid -->
      <div class="p-6 space-y-6">
        <!-- Premium Plan -->
        <div 
          @click="selectPlan('Premium', 9.99)"
          :class="selectedPlan === 'Premium' 
            ? (isDarkMode ? 'bg-red-600/20 border-red-500 ring-2 ring-red-500' : 'bg-red-50 border-red-300 ring-2 ring-red-500')
            : (isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300')"
          class="p-6 rounded-xl border cursor-pointer transition"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold">Premium</h3>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Perfect for one user</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-red-600">$9.99</p>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs">/month</p>
            </div>
          </div>
          <ul class="space-y-2 mb-4 text-sm">
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
              </svg>
              Watch in 4K
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
              </svg>
              2 screens simultaneously
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
              </svg>
              Ad-free content
            </li>
          </ul>
          <div v-if="selectedPlan === 'Premium'" class="text-xs font-semibold text-green-500">✓ Selected</div>
        </div>

        <!-- Premium Plus Plan -->
        <div 
          @click="selectPlan('Premium Plus', 19.99)"
          :class="selectedPlan === 'Premium Plus' 
            ? (isDarkMode ? 'bg-red-600/20 border-red-500 ring-2 ring-red-500' : 'bg-red-50 border-red-300 ring-2 ring-red-500')
            : (isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300')"
          class="p-6 rounded-xl border cursor-pointer transition relative"
        >
          <div class="absolute -top-3 -right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            Most Popular
          </div>
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold">Premium Plus</h3>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm">For the whole family</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-red-600">$19.99</p>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs">/month</p>
            </div>
          </div>
          <ul class="space-y-2 mb-4 text-sm">
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
              </svg>
              Watch in 4K
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
              </svg>
              4 screens simultaneously
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
              </svg>
              Ad-free content
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
              </svg>
              Download & watch offline
            </li>
          </ul>
          <div v-if="selectedPlan === 'Premium Plus'" class="text-xs font-semibold text-green-500">✓ Selected</div>
        </div>

        <!-- Current Status -->
        <div v-if="currentPaymentStatus" :class="isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'" class="p-4 rounded-lg border-l-4 border-l-blue-500 text-sm">
          <p class="font-semibold">Current Status: <span class="capitalize">{{ currentPaymentStatus.status }}</span></p>
          <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs mt-1">Plan: {{ currentPaymentStatus.plan_name }} (${{ currentPaymentStatus.amount }})</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="success" class="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200 text-sm">
          Payment submitted! Waiting for admin approval...
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-4">
          <button 
            @click="$emit('close')"
            class="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition"
          >
            Cancel
          </button>
          <button 
            @click="submitPayment"
            :disabled="!selectedPlan || loading"
            :class="!selectedPlan || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'"
            class="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-lg transition"
          >
            {{ loading ? 'Processing...' : 'Submit Payment' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'payment-submitted'])

const selectedPlan = ref(null)
const loading = ref(false)
const error = ref('')
const success = ref(false)
const currentPaymentStatus = ref(null)

const isDarkMode = computed(() => {
  const theme = localStorage.getItem('theme') || 'dark'
  return theme !== 'light'
})

const selectPlan = (plan, amount) => {
  selectedPlan.value = plan
  error.value = ''
  success.value = false
}

const submitPayment = async () => {
  if (!selectedPlan.value) return

  loading.value = true
  error.value = ''
  success.value = false

  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:5000/api/auth/submit-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        planName: selectedPlan.value,
        amount: selectedPlan.value === 'Premium' ? 9.99 : 19.99
      })
    })

    if (response.ok) {
      success.value = true
      emit('payment-submitted')
      setTimeout(() => {
        emit('close')
      }, 2000)
    } else {
      const data = await response.json()
      error.value = data.error || 'Failed to submit payment'
    }
  } catch (err) {
    error.value = err.message || 'Failed to submit payment'
  } finally {
    loading.value = false
  }
}

const loadPaymentStatus = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:5000/api/auth/payment-status', {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.ok) {
      const data = await response.json()
      currentPaymentStatus.value = data.payment
    }
  } catch (err) {
    console.error('Error loading payment status:', err)
  }
}

onMounted(() => {
  loadPaymentStatus()
})
</script>
