<template>
  <div class="flex flex-col min-h-screen bg-[#141414] text-white overflow-x-hidden">
    <!-- Conditionally render Navbar -->
    <Navbar v-if="!route.meta.hideNavbar" />
    
    <!-- Main Content with Transition -->
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Conditionally render Footer -->
    <Footer v-if="!route.meta.hideFooter" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();
</script>

<style>
/* Global Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>