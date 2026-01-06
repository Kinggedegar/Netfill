<template>
  <div 
    @click="$emit('select', movie)"
    class="group relative flex flex-col gap-2 cursor-pointer transition-transform duration-300 hover:scale-105"
  >
    <div class="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 shadow-xl">
      <img
        :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster'"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div class="w-12 h-12 bg-[#F5C518] rounded-full flex items-center justify-center text-black shadow-lg">
          <svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <!-- HD Tag -->
      <div class="absolute top-2 right-2 bg-[#F5C518] text-black text-[10px] font-bold px-1 rounded">HD</div>
    </div>
    
    <h3 class="text-white text-sm font-medium truncate group-hover:text-[#F5C518] transition-colors">
      {{ movie.title || movie.name }}
    </h3>
  </div>
</template>

<script setup>
defineProps(['movie'])
</script>