<template>
  <div class="min-h-screen bg-[#121212] text-white pt-24 px-4 md:px-12 pb-12">
    <div class="max-w-6xl mx-auto">
      
      <!-- Page Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p class="text-gray-400 max-w-2xl mx-auto text-lg">
          Have a question about the MovieBox? We're here to help. Our team usually responds within 24 hours.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-start">
        
        <!-- Contact Info (Left) -->
        <div class="space-y-8">
          <div class="bg-[#1D1D1D] p-8 rounded-xl border border-gray-800">
            <h3 class="text-2xl font-bold text-[#F5C518] mb-6">Get in touch</h3>
            
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-[#F5C518]">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <h4 class="font-bold text-white">Email Us</h4>
                  <p class="text-gray-400">support@movieboxpro.com</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-[#F5C518]">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div>
                  <h4 class="font-bold text-white">Call Us</h4>
                  <p class="text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-[#F5C518]">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <h4 class="font-bold text-white">Location</h4>
                  <p class="text-gray-400">123 Cinema Blvd, Hollywood, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form (Right) -->
        <form @submit.prevent="submitForm" class="bg-[#1D1D1D] p-8 rounded-xl border border-gray-800 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-400">First Name</label>
              <input type="text" class="w-full bg-[#2A2A2A] border border-transparent focus:border-[#F5C518] rounded p-3 text-white outline-none" placeholder="Jane" required>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-400">Last Name</label>
              <input type="text" class="w-full bg-[#2A2A2A] border border-transparent focus:border-[#F5C518] rounded p-3 text-white outline-none" placeholder="Doe" required>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-400">Email</label>
            <input type="email" class="w-full bg-[#2A2A2A] border border-transparent focus:border-[#F5C518] rounded p-3 text-white outline-none" placeholder="jane@example.com" required>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-400">Subject</label>
            <select class="w-full bg-[#2A2A2A] border border-transparent focus:border-[#F5C518] rounded p-3 text-white outline-none">
              <option>General Inquiry</option>
              <option>Technical Support</option>
              <option>Billing Issue</option>
              <option>Feature Request</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-400">Message</label>
            <textarea rows="4" class="w-full bg-[#2A2A2A] border border-transparent focus:border-[#F5C518] rounded p-3 text-white outline-none" placeholder="How can we help?" required></textarea>
          </div>

          <button type="submit" class="w-full bg-[#F5C518] hover:bg-[#d4a910] text-black font-bold py-3 rounded transition">
            Send Message
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
const submitForm = () => {
  alert('Thank you! Your message has been sent.')
}
</script>