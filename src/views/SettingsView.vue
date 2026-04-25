<template>
  <div class="flex-1 overflow-y-auto" :class="isDarkMode ? 'bg-black' : 'bg-gray-50'">
    <!-- Header -->
    <div :class="isDarkMode ? 'bg-gradient-to-b from-red-600 to-transparent' : 'bg-gradient-to-b from-red-500 to-red-400'" class="p-8 mb-8">
      <h1 class="text-4xl font-bold mb-2 text-white">Settings</h1>
      <p :class="isDarkMode ? 'text-gray-300' : 'text-red-100'">Customize your Netfill experience</p>
    </div>

    <div :class="isDarkMode ? 'px-8' : 'px-8 text-gray-900'" class="max-w-4xl">
      <!-- Theme Settings -->
      <section :class="isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'" class="rounded-lg p-6 mb-6 shadow-lg">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
          </svg>
          Appearance
        </h2>

        <div class="space-y-4">
          <!-- Theme Toggle -->
          <div :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-100'" class="flex items-center justify-between p-4 rounded-lg">
            <div>
              <h3 class="font-semibold text-lg">Theme</h3>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Choose your preferred theme</p>
            </div>
            <div class="flex gap-3">
              <button
                @click="setTheme('light')"
                :class="[
                  'px-6 py-2 rounded-lg font-semibold transition-all',
                  theme === 'light'
                    ? 'bg-yellow-500 text-black'
                    : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                <svg class="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 011.414 0zM4 11a1 1 0 100 2H3a1 1 0 100-2h1z" clip-rule="evenodd"/>
                </svg>
                Light
              </button>
              <button
                @click="setTheme('dark')"
                :class="[
                  'px-6 py-2 rounded-lg font-semibold transition-all',
                  theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                <svg class="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                </svg>
                Dark
              </button>
              <button
                @click="setTheme('auto')"
                :class="[
                  'px-6 py-2 rounded-lg font-semibold transition-all',
                  theme === 'auto'
                    ? 'bg-purple-600 text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                <svg class="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 11a1 1 0 11-2 0 1 1 0 012 0zM19 11a1 1 0 11-2 0 1 1 0 012 0zM9 3a1 1 0 11-2 0 1 1 0 012 0zM9 17a1 1 0 11-2 0 1 1 0 012 0z"/>
                </svg>
                Auto
              </button>
            </div>
          </div>

          <!-- Primary Color -->
          <div :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-100'" class="flex items-center justify-between p-4 rounded-lg">
            <div>
              <h3 class="font-semibold text-lg">Primary Color</h3>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Choose your preferred accent color</p>
            </div>
            <div class="flex gap-3">
              <button
                @click="setPrimaryColor('red')"
                :class="[
                  'w-10 h-10 rounded-full transition-transform',
                  primaryColor === 'red' ? 'bg-red-600 ring-2 ring-white scale-110' : 'bg-red-600 hover:scale-105'
                ]"
              />
              <button
                @click="setPrimaryColor('blue')"
                :class="[
                  'w-10 h-10 rounded-full transition-transform',
                  primaryColor === 'blue' ? 'bg-blue-600 ring-2 ring-white scale-110' : 'bg-blue-600 hover:scale-105'
                ]"
              />
              <button
                @click="setPrimaryColor('purple')"
                :class="[
                  'w-10 h-10 rounded-full transition-transform',
                  primaryColor === 'purple' ? 'bg-purple-600 ring-2 ring-white scale-110' : 'bg-purple-600 hover:scale-105'
                ]"
              />
              <button
                @click="setPrimaryColor('green')"
                :class="[
                  'w-10 h-10 rounded-full transition-transform',
                  primaryColor === 'green' ? 'bg-green-600 ring-2 ring-white scale-110' : 'bg-green-600 hover:scale-105'
                ]"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Language Settings -->
      <section :class="isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'" class="rounded-lg p-6 mb-6 shadow-lg">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
          </svg>
          Language
        </h2>

        <div class="space-y-2">
          <select
            v-model="language"
            @change="setLanguage"
            :class="isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-red-600' : 'bg-white border-gray-300 text-gray-900 focus:border-red-600'"
            class="w-full p-3 border rounded-lg focus:outline-none"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="pt">Português</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </section>

      <!-- Notification Settings -->
      <section :class="isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'" class="rounded-lg p-6 mb-6 shadow-lg">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          Notifications
        </h2>

        <div class="space-y-3">
          <label :class="isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'" class="flex items-center justify-between p-4 rounded-lg cursor-pointer transition">
            <span class="font-semibold">Email Notifications</span>
            <input
              type="checkbox"
              v-model="notificationsEnabled"
              @change="updateNotifications"
              class="w-5 h-5 accent-red-600"
            />
          </label>
        </div>
      </section>

      <!-- Account Settings -->
      <section :class="isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'" class="rounded-lg p-6 mb-6 shadow-lg">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Account
        </h2>

        <div class="space-y-3">
          <button :class="isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'" class="w-full p-3 rounded-lg text-left font-semibold transition">
            Change Password
          </button>
          <button :class="isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'" class="w-full p-3 rounded-lg text-left font-semibold transition">
            Manage Devices
          </button>
          <button class="w-full p-3 bg-red-900 hover:bg-red-800 rounded-lg text-left font-semibold transition text-red-100">
            Delete Account
          </button>
        </div>
      </section>

      <!-- Save Button -->
      <button
        @click="saveSettings"
        class="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition mb-8"
      >
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const theme = ref('dark');
const primaryColor = ref('red');
const language = ref('en');
const notificationsEnabled = ref(true);
const isDarkMode = computed(() => theme.value !== 'light');

onMounted(() => {
  // Load settings from localStorage
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const savedColor = localStorage.getItem('primaryColor') || 'red';
  const savedLanguage = localStorage.getItem('language') || 'en';
  const savedNotifications = localStorage.getItem('notifications') !== 'false';

  theme.value = savedTheme;
  primaryColor.value = savedColor;
  language.value = savedLanguage;
  notificationsEnabled.value = savedNotifications;

  applyTheme(savedTheme);
});

const setTheme = (newTheme) => {
  theme.value = newTheme;
  applyTheme(newTheme);
};

const setPrimaryColor = (color) => {
  primaryColor.value = color;
  localStorage.setItem('primaryColor', color);
};

const setLanguage = () => {
  localStorage.setItem('language', language.value);
};

const updateNotifications = () => {
  localStorage.setItem('notifications', notificationsEnabled.value);
};

const applyTheme = (themeValue) => {
  const html = document.documentElement;
  const body = document.body;

  if (themeValue === 'light') {
    html.classList.remove('dark');
    body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else if (themeValue === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
      body.classList.add('dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', 'auto');
  } else {
    html.classList.add('dark');
    body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

const saveSettings = () => {
  alert('Settings saved successfully!');
};
</script>
