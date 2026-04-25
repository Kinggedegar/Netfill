<template>
  <div class="flex min-h-screen text-white overflow-x-hidden" :class="isDarkMode ? 'bg-black dark' : 'bg-white light'">
    <!-- Sidebar Navigation -->
    <Sidebar v-if="!route.meta.hideSidebar" />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Main Content with Transition -->
      <main class="flex-grow">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>

      <!-- Conditionally render Footer -->
      <Footer v-if="!route.meta.hideFooter" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import Footer from '@/components/Footer.vue';
import Sidebar from '@/components/Sidebar.vue';

const route = useRoute();
const isDarkMode = ref(true);

onMounted(() => {
  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'dark';
  isDarkMode.value = savedTheme !== 'light';
  applyTheme(savedTheme);

  // Listen for theme changes in other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      isDarkMode.value = e.newValue !== 'light';
      applyTheme(e.newValue);
    }
  });
});

const applyTheme = (theme) => {
  const html = document.documentElement;
  const body = document.body;

  if (theme === 'light') {
    html.classList.remove('dark');
    body.classList.remove('dark');
    body.style.backgroundColor = '#ffffff';
  } else if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
      body.classList.add('dark');
      body.style.backgroundColor = '#000000';
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
      body.style.backgroundColor = '#ffffff';
    }
  } else {
    html.classList.add('dark');
    body.classList.add('dark');
    body.style.backgroundColor = '#000000';
  }
};

watch(() => route.path, () => {
  // Reset scroll on route change
  window.scrollTo(0, 0);
});
</script>

<style>
html.dark {
  color-scheme: dark;
  scrollbar-color: #333 #000;
}

html.light {
  color-scheme: light;
  scrollbar-color: #ccc #fff;
}

html.dark::-webkit-scrollbar {
  width: 12px;
  background: #000;
}

html.dark::-webkit-scrollbar-track {
  background: #000;
}

html.dark::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 6px;
}

html.dark::-webkit-scrollbar-thumb:hover {
  background: #555;
}

html.light::-webkit-scrollbar {
  width: 12px;
  background: #fff;
}

html.light::-webkit-scrollbar-track {
  background: #fff;
}

html.light::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 6px;
}

html.light::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

body.dark {
  background-color: #000000;
  color: #ffffff;
}

body.light {
  background-color: #ffffff;
  color: #000000;
}
</style>

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