<template>
  <div :class="isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'" class="w-full pt-8 px-4 pb-12">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Platform Management & Analytics</p>
      </div>

      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total Users -->
        <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-blue-50 border-blue-200'" class="p-6 rounded-lg border">
          <div class="flex items-start justify-between">
            <div>
              <p :class="isDarkMode ? 'text-blue-300' : 'text-blue-600'" class="text-sm font-semibold mb-2">Total Users</p>
              <p class="text-4xl font-bold">1,250</p>
              <p :class="isDarkMode ? 'text-green-400' : 'text-green-600'" class="text-xs mt-2">+8.2% from last month</p>
            </div>
            <div :class="isDarkMode ? 'bg-blue-500/20' : 'bg-blue-200'" class="p-3 rounded-lg">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
          </div>
        </div>

        <!-- Active Today -->
        <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-green-50 border-green-200'" class="p-6 rounded-lg border">
          <div class="flex items-start justify-between">
            <div>
              <p :class="isDarkMode ? 'text-green-300' : 'text-green-600'" class="text-sm font-semibold mb-2">Active Today</p>
              <p class="text-4xl font-bold">487</p>
              <p :class="isDarkMode ? 'text-green-400' : 'text-green-600'" class="text-xs mt-2">38.9% of total users</p>
            </div>
            <div :class="isDarkMode ? 'bg-green-500/20' : 'bg-green-200'" class="p-3 rounded-lg">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
          </div>
        </div>

        <!-- Pending Payments -->
        <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-yellow-50 border-yellow-200'" class="p-6 rounded-lg border">
          <div class="flex items-start justify-between">
            <div>
              <p :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-600'" class="text-sm font-semibold mb-2">Pending Payments</p>
              <p class="text-4xl font-bold">24</p>
              <p :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" class="text-xs mt-2">Needs approval</p>
            </div>
            <div :class="isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-200'" class="p-3 rounded-lg">
              <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-red-50 border-red-200'" class="p-6 rounded-lg border">
          <div class="flex items-start justify-between">
            <div>
              <p :class="isDarkMode ? 'text-red-300' : 'text-red-600'" class="text-sm font-semibold mb-2">Total Revenue</p>
              <p class="text-4xl font-bold">$45,890</p>
              <p :class="isDarkMode ? 'text-green-400' : 'text-green-600'" class="text-xs mt-2">+12.5% from last month</p>
            </div>
            <div :class="isDarkMode ? 'bg-red-500/20' : 'bg-red-200'" class="p-3 rounded-lg">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8L5.257 19.393A2 2 0 005 18.07V5a2 2 0 012-2h14a2 2 0 012 2v10z"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Recent User Logins -->
        <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="p-6 rounded-lg border">
          <h2 class="text-xl font-bold mb-4">Recent User Logins</h2>
          <div class="space-y-4">
            <div v-for="(login, idx) in userLogins" :key="idx" :class="isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'" class="p-4 rounded-lg transition">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <p class="font-semibold">{{ login.username }}</p>
                  <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm">{{ login.email }}</p>
                </div>
                <span :class="login.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'" class="px-2 py-1 rounded text-xs font-semibold">
                  {{ login.role }}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs" :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">
                <span>{{ login.device }}</span>
                <span>{{ login.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Payments Management -->
        <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="p-6 rounded-lg border">
          <h2 class="text-xl font-bold mb-4">Pending Payments</h2>
          <div class="space-y-3">
            <div v-for="(payment, idx) in pendingPayments" :key="idx" :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-50'" class="p-4 rounded-lg flex items-center justify-between">
              <div class="flex-1">
                <p class="font-semibold">{{ payment.username }}</p>
                <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm">{{ payment.plan }} • {{ payment.email }}</p>
                <p class="text-lg font-bold mt-1">${{ payment.amount }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="approvePayment(idx)" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-semibold transition">
                  Approve
                </button>
                <button @click="rejectPayment(idx)" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-semibold transition">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Frequently Watched Movies -->
        <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="p-6 rounded-lg border">
          <h2 class="text-xl font-bold mb-4">Top Watched Movies</h2>
          <div class="space-y-4">
            <div v-for="(movie, idx) in frequentlyWatched" :key="idx" class="space-y-2">
              <div class="flex items-center justify-between">
                <p class="font-semibold text-sm">{{ movie.title }}</p>
                <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs">{{ movie.views }} views</p>
              </div>
              <div :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-200'" class="w-full h-2 rounded-full overflow-hidden">
                <div :style="{ width: (movie.views / 5000) * 100 + '%' }" class="h-full bg-gradient-to-r from-red-500 to-red-600"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Weekly Activity Chart -->
        <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="p-6 rounded-lg border">
          <h2 class="text-xl font-bold mb-4">Weekly Activity</h2>
          <div class="flex items-end justify-between gap-2 h-40">
            <div v-for="(day, idx) in weeklyActivity" :key="idx" class="flex-1 flex flex-col items-center gap-2">
              <div class="flex flex-col items-center gap-1">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs font-semibold">{{ day.users }}</span>
                <div 
                  :style="{ height: (day.users / 500) * 100 + 'px' }"
                  class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t"
                ></div>
              </div>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs">{{ day.day }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- AI-Powered Insights Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Intelligent Platform Analytics</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Churn Risk Monitor -->
          <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="p-6 rounded-lg border">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold">At-Risk Users (Churn Alert)</h3>
              <span :class="isDarkMode ? 'bg-red-500/20' : 'bg-red-100'" class="px-3 py-1 rounded-full text-xs font-bold text-red-500">⚠ {{ churnRiskUsers.length }} Users</span>
            </div>
            <div class="space-y-3 max-h-60 overflow-y-auto">
              <div v-for="(user, idx) in churnRiskUsers" :key="idx" :class="isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'" class="p-3 rounded border-l-4 border-l-red-500">
                <div class="flex items-start justify-between mb-1">
                  <p class="font-semibold text-sm">{{ user.username }}</p>
                  <span :class="user.riskLevel === 'critical' ? 'bg-red-600' : user.riskLevel === 'high' ? 'bg-orange-500' : 'bg-yellow-500'" class="px-2 py-0.5 rounded text-xs text-white font-bold">
                    {{ user.riskLevel.toUpperCase() }}
                  </span>
                </div>
                <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs mb-2">📉 {{ user.reason }}</p>
                <div class="text-xs font-mono" :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">Last active: {{ user.lastActive }}</div>
              </div>
            </div>
          </div>

          <!-- Content Gap Analyzer -->
          <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="p-6 rounded-lg border">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold">Content Gaps (Search Misses)</h3>
              <span :class="isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'" class="px-3 py-1 rounded-full text-xs font-bold text-orange-500">🔍 {{ contentGaps.length }} Terms</span>
            </div>
            <div class="space-y-3 max-h-60 overflow-y-auto">
              <div v-for="(gap, idx) in contentGaps" :key="idx" :class="isDarkMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'" class="p-3 rounded border-l-4 border-l-orange-500">
                <div class="flex items-center justify-between mb-1">
                  <p class="font-semibold text-sm">{{ gap.searchTerm }}</p>
                  <span class="text-xs font-bold text-orange-500">{{ gap.searches }} searches</span>
                </div>
                <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs">💡 Suggestion: Add {{ gap.suggestion }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Intelligence Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Peak Hours Optimizer -->
        <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="p-6 rounded-lg border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">Peak Hours Optimizer</h3>
            <span class="text-xl">🚀</span>
          </div>
          <div class="space-y-3">
            <div v-for="(hour, idx) in peakHours" :key="idx" class="p-3" :class="isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'" style="border-left: 3px solid rgb(59, 130, 246)">
              <div class="flex items-center justify-between mb-1">
                <p class="font-semibold text-sm">{{ hour.time }}</p>
                <p class="text-xs font-bold text-blue-500">{{ hour.avg }}K viewers</p>
              </div>
              <div :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-200'" class="w-full h-1 rounded-full overflow-hidden">
                <div :style="{ width: (hour.avg / 15) * 100 + '%' }" class="h-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
              </div>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs mt-2">Best for: {{ hour.recommendation }}</p>
            </div>
          </div>
        </div>

        <!-- Content Health Scores -->
        <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="p-6 rounded-lg border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">Content Health Scores</h3>
            <span class="text-xl">💪</span>
          </div>
          <div class="space-y-3">
            <div v-for="(content, idx) in contentHealthScores" :key="idx" class="p-3" :class="content.score >= 80 ? (isDarkMode ? 'bg-green-500/10' : 'bg-green-50') : content.score >= 60 ? (isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50') : (isDarkMode ? 'bg-red-500/10' : 'bg-red-50')" :style="{ borderLeft: '3px solid ' + (content.score >= 80 ? '#10b981' : content.score >= 60 ? '#f59e0b' : '#ef4444') }">
              <div class="flex items-center justify-between mb-1">
                <p class="font-semibold text-sm text-left">{{ content.title }}</p>
                <p class="text-xs font-bold" :class="content.score >= 80 ? 'text-green-500' : content.score >= 60 ? 'text-yellow-500' : 'text-red-500'">{{ content.score }}/100</p>
              </div>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs">{{ content.status }}</p>
            </div>
          </div>
        </div>

        <!-- Smart Recommendations -->
        <div :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'" class="p-6 rounded-lg border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">AI Recommendations</h3>
            <span class="text-xl">✨</span>
          </div>
          <div class="space-y-3">
            <div v-for="(rec, idx) in smartRecommendations" :key="idx" class="p-3 rounded-lg" :class="rec.priority === 'urgent' ? (isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200') : (isDarkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200')" :style="{ borderLeft: '3px solid ' + (rec.priority === 'urgent' ? '#ef4444' : '#10b981') }">
              <p class="font-semibold text-sm mb-1">{{ rec.action }}</p>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs mb-2">{{ rec.reason }}</p>
              <button class="text-xs px-2 py-1 rounded bg-opacity-20 font-semibold transition hover:bg-opacity-30" :class="rec.priority === 'urgent' ? 'bg-red-500 text-red-400' : 'bg-green-500 text-green-400'">
                Implement →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Logout Button -->
      <div class="flex justify-end">
        <button
          @click="logout"
          class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = ref({
  totalUsers: 1250,
  activeToday: 487,
  pendingPayments: 24,
  totalRevenue: 45890
})

const userLogins = ref([
  { username: 'john_doe', email: 'john@example.com', role: 'user', device: 'Chrome on MacOS', time: '2 mins ago' },
  { username: 'jane_smith', email: 'jane@example.com', role: 'user', device: 'Safari on iPhone', time: '5 mins ago' },
  { username: 'admin_user', email: 'admin@example.com', role: 'admin', device: 'Firefox on Windows', time: '12 mins ago' },
  { username: 'mike_wilson', email: 'mike@example.com', role: 'user', device: 'Chrome on Windows', time: '18 mins ago' },
  { username: 'sarah_jones', email: 'sarah@example.com', role: 'user', device: 'Edge on Mac', time: '23 mins ago' },
  { username: 'alex_brown', email: 'alex@example.com', role: 'user', device: 'Safari on iPad', time: '31 mins ago' }
])

const pendingPayments = ref([
  { id: 1, username: 'john_doe', email: 'john@example.com', plan: 'Premium', amount: 9.99 },
  { id: 2, username: 'jane_smith', email: 'jane@example.com', plan: 'Premium Plus', amount: 19.99 },
  { id: 3, username: 'mike_wilson', email: 'mike@example.com', plan: 'Premium', amount: 9.99 },
  { id: 4, username: 'sarah_jones', email: 'sarah@example.com', plan: 'Premium Plus', amount: 19.99 }
])

const frequentlyWatched = ref([
  { title: 'Inception', views: 4820 },
  { title: 'The Matrix', views: 4350 },
  { title: 'Interstellar', views: 3890 },
  { title: 'Pulp Fiction', views: 3420 },
  { title: 'Fight Club', views: 2950 }
])

const weeklyActivity = ref([
  { day: 'Mon', users: 280 },
  { day: 'Tue', users: 350 },
  { day: 'Wed', users: 420 },
  { day: 'Thu', users: 380 },
  { day: 'Fri', users: 480 },
  { day: 'Sat', users: 450 },
  { day: 'Sun', users: 320 }
])

const churnRiskUsers = ref([
  { username: 'john_doe', reason: 'Watch time declined 78% this month', riskLevel: 'critical', lastActive: '5 days ago' },
  { username: 'mike_wilson', reason: 'Not watched anything in 2 weeks', riskLevel: 'critical', lastActive: '14 days ago' },
  { username: 'sarah_jones', reason: 'Only 2 sessions in past 30 days', riskLevel: 'high', lastActive: '3 days ago' },
  { username: 'emily_clark', reason: 'Declining engagement with recommendations', riskLevel: 'high', lastActive: '2 days ago' }
])

const contentGaps = ref([
  { searchTerm: 'K-drama romance', searches: 342, suggestion: 'more K-drama content' },
  { searchTerm: 'Sci-fi thriller', searches: 287, suggestion: 'underrepresented sci-fi' },
  { searchTerm: 'Stand-up comedy', searches: 215, suggestion: 'comedy specials' },
  { searchTerm: 'Indian cinema', searches: 198, suggestion: 'Bollywood & regional films' },
  { searchTerm: 'True crime documentary', searches: 176, suggestion: 'true crime series' }
])

const peakHours = ref([
  { time: '8-9 PM', avg: 14.2, recommendation: 'New releases, blockbusters' },
  { time: '9-10 PM', avg: 12.8, recommendation: 'Premium content' },
  { time: '12-1 AM', avg: 8.5, recommendation: 'Binge-worthy series' },
  { time: '7-8 PM', avg: 11.3, recommendation: 'Family content' },
  { time: '6-7 AM', avg: 4.2, recommendation: 'Light/comedy shows' }
])

const contentHealthScores = ref([
  { title: 'Inception', score: 94, status: '🔥 Exceptional - Top performer' },
  { title: 'The Matrix', score: 87, status: '✅ Excellent - Strong engagement' },
  { title: 'Pulp Fiction', score: 72, status: '⚠️ Good - Consider re-promoting' },
  { title: 'Avatar 2', score: 45, status: '❌ Poor - High drop-off rate' },
  { title: 'Interstellar', score: 91, status: '✅ Excellent - Cult favorite' }
])

const smartRecommendations = ref([
  { action: 'Promote "Inception" on weekends', reason: 'Peak engagement on Fri-Sat, 89% completion rate', priority: 'urgent' },
  { action: 'Add K-drama category & content', reason: '342 failed searches this week - clear demand', priority: 'urgent' },
  { action: 'Reach out to john_doe', reason: 'At critical churn risk - offer premium trial', priority: 'urgent' },
  { action: 'Schedule new release for 8 PM Thursday', reason: 'Optimal time slot for maximum concurrent viewers', priority: 'normal' },
  { action: 'Retire underperforming content', reason: '"Avatar 2" has 45/100 health score - low ROI', priority: 'normal' }
])

const isDarkMode = computed(() => {
  const theme = localStorage.getItem('theme') || 'dark'
  if (theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return theme !== 'light'
})

const loadPendingPayments = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await fetch('http://localhost:5000/api/admin/pending-payments', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.ok) {
      const data = await response.json()
      // Reformat data for display
      pendingPayments.value = (data.payments || []).map(p => ({
        id: p.id,
        username: p.username,
        email: p.email,
        plan: p.plan_name,
        amount: p.amount
      }))
      stats.value.pendingPayments = pendingPayments.value.length
    }
  } catch (error) {
    console.error('Error loading pending payments:', error)
  }
}

const loadUserLogins = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await fetch('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.ok) {
      const data = await response.json()
      // Just use mock data for now - you can add API endpoint later
      console.log('Users loaded:', data.users?.length)
    }
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

onMounted(() => {
  loadPendingPayments()
  loadUserLogins()
  // Refresh pending payments every 30 seconds
  setInterval(loadPendingPayments, 30000)
})

const approvePayment = async (idx) => {
  try {
    const payment = pendingPayments.value[idx]
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:5000/api/admin/payment/${payment.id}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      console.log(`Approved payment for ${payment.username}`)
      pendingPayments.value.splice(idx, 1)
      stats.value.pendingPayments--
    }
  } catch (error) {
    console.error('Error approving payment:', error)
  }
}

const rejectPayment = async (idx) => {
  try {
    const payment = pendingPayments.value[idx]
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:5000/api/admin/payment/${payment.id}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      console.log(`Rejected payment for ${payment.username}`)
      pendingPayments.value.splice(idx, 1)
      stats.value.pendingPayments--
    }
  } catch (error) {
    console.error('Error rejecting payment:', error)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userName')
  localStorage.removeItem('userRole')
  router.push('/signin')
}
</script>

<style scoped>
</style>
