<template>
  <div class="flex flex-col min-h-screen bg-[#141414]">
    <Navbar />
    <router-view class="flex-grow" />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>