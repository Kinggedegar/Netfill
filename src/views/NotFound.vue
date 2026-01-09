<template>
  <div class="min-h-screen bg-[#141414] text-white flex items-center justify-center flex-col text-center px-4">
    <h1 class="text-9xl font-black text-[#222]">404</h1>
    <h2 class="text-3xl md:text-5xl font-bold -mt-10 mb-6 relative z-10 text-shadow">Lost your way?</h2>
    <p class="text-xl text-gray-400 mb-8 max-w-lg">
      Sorry, we can't find that page. You'll find loads to explore on the home page.
    </p>
    <router-link 
      to="/" 
      class="bg-white text-black px-8 py-3 rounded font-bold text-lg hover:bg-gray-200 transition"
    >
      NetFill Home
    </router-link>
    <div class="mt-12 text-sm text-gray-600 border-l-2 border-red-600 pl-4">
      Error Code: NSES-404
    </div>
  </div>
</template>

<style scoped>
.text-shadow { text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
</style>