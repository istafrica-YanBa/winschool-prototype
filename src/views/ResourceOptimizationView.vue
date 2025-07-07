<template>
  <div class="resource-optimization bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Ressourcenoptimierung' : 'Resource Optimization' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'KI-gestützte Optimierung von Räumen, Lehrern und Ausstattung' : 'AI-powered optimization of rooms, teachers, and equipment' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <router-link
          to="/dashboard/support"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <LifeBuoy class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Support' : 'Support' }}
        </router-link>
        <button @click="exportReport" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ language === 'de' ? 'Bericht exportieren' : 'Export Report' }}
        </button>
        <button @click="runOptimization" :disabled="isOptimizing" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
          <svg v-if="isOptimizing" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {{ isOptimizing ? (language === 'de' ? 'Optimiert...' : 'Optimizing...') : (language === 'de' ? 'Optimierung starten' : 'Run Optimization') }}
        </button>
      </div>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <!-- Room Utilization -->
      <div class="bg-white dark:bg-slate-800 shadow rounded-xl px-5 py-4 hover:shadow-lg transition-shadow relative overflow-hidden">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="text-sm text-gray-600 dark:text-slate-400 mb-1" style="font-family: Inter, sans-serif;">Room Utilization</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-2" style="font-family: Inter, sans-serif;">{{ optimizationStats.roomUtilization }}%</div>
            <div class="flex items-center">
              <span class="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full" style="font-family: Inter, sans-serif;">
                +{{ optimizationStats.roomUtilizationChange }}%
              </span>
              <span class="text-xs text-gray-500 dark:text-slate-400 ml-2" style="font-family: Inter, sans-serif;">vs last run</span>
            </div>
          </div>
        </div>
        <div class="absolute top-2 right-2">
          <div class="w-2 h-8 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      <!-- Teacher Utilization -->
      <div class="bg-white dark:bg-slate-800 shadow rounded-xl px-5 py-4 hover:shadow-lg transition-shadow relative overflow-hidden">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="text-sm text-gray-600 dark:text-slate-400 mb-1" style="font-family: Inter, sans-serif;">Teacher Utilization</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-2" style="font-family: Inter, sans-serif;">{{ optimizationStats.teacherUtilization }}%</div>
            <div class="flex items-center">
              <span class="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full" style="font-family: Inter, sans-serif;">
                +{{ optimizationStats.teacherUtilizationChange }}%
              </span>
              <span class="text-xs text-gray-500 dark:text-slate-400 ml-2" style="font-family: Inter, sans-serif;">vs last run</span>
            </div>
          </div>
        </div>
        <div class="absolute top-2 right-2">
          <div class="w-2 h-8 bg-green-500 rounded-full"></div>
        </div>
      </div>

      <!-- Cost Savings -->
      <div class="bg-white dark:bg-slate-800 shadow rounded-xl px-5 py-4 hover:shadow-lg transition-shadow relative overflow-hidden">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="text-sm text-gray-600 dark:text-slate-400 mb-1" style="font-family: Inter, sans-serif;">Cost Savings</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-2" style="font-family: Inter, sans-serif;">€{{ optimizationStats.costSavings.toLocaleString() }}</div>
            <div class="flex items-center">
              <span class="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full" style="font-family: Inter, sans-serif;">
                +€{{ optimizationStats.costSavingsChange.toLocaleString() }}
              </span>
              <span class="text-xs text-gray-500 dark:text-slate-400 ml-2" style="font-family: Inter, sans-serif;">vs last run</span>
            </div>
          </div>
        </div>
        <div class="absolute top-2 right-2">
          <div class="w-2 h-8 bg-yellow-500 rounded-full"></div>
        </div>
      </div>

      <!-- Efficiency Gain -->
      <div class="bg-white dark:bg-slate-800 shadow rounded-xl px-5 py-4 hover:shadow-lg transition-shadow relative overflow-hidden">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="text-sm text-gray-600 dark:text-slate-400 mb-1" style="font-family: Inter, sans-serif;">Efficiency Gain</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-2" style="font-family: Inter, sans-serif;">{{ optimizationStats.efficiencyGain }}%</div>
            <div class="flex items-center">
              <span class="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full" style="font-family: Inter, sans-serif;">
                +{{ optimizationStats.efficiencyGainChange }}%
              </span>
              <span class="text-xs text-gray-500 dark:text-slate-400 ml-2" style="font-family: Inter, sans-serif;">vs last run</span>
            </div>
          </div>
        </div>
        <div class="absolute top-2 right-2">
          <div class="w-2 h-8 bg-purple-500 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- AI Optimization Engine -->
      <div class="lg:col-span-4">
        <div class="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 mb-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-slate-50" style="font-family: Inter, sans-serif;">AI Optimization Engine</h2>
          </div>
          
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3" style="font-family: Inter, sans-serif;">Optimization Parameters</h3>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-600 dark:text-slate-400 mb-1" style="font-family: Inter, sans-serif;">Priority</label>
                <select
                  v-model="optimizationSettings.priority"
                  class="w-full text-sm bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-slate-50"
                  style="font-family: Inter, sans-serif;"
                >
                  <option value="efficiency">⚡ Efficiency</option>
                  <option value="cost">💰 Cost</option>
                  <option value="balance">⚖️ Balance</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-600 dark:text-slate-400 mb-1" style="font-family: Inter, sans-serif;">Time Period</label>
                <select
                  v-model="optimizationSettings.timePeriod"
                  class="w-full text-sm bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-slate-50"
                  style="font-family: Inter, sans-serif;"
                >
                  <option value="this-week">📅 This Week</option>
                  <option value="next-week">📅 Next Week</option>
                  <option value="this-month">📅 This Month</option>
                  <option value="next-month">📅 Next Month</option>
                </select>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3" style="font-family: Inter, sans-serif;">Optimization Goals</h3>
            <div class="space-y-2">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="optimizationSettings.goals"
                  type="checkbox"
                  value="room-utilization"
                  class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <span class="ml-3 text-sm text-gray-700 flex items-center" style="font-family: Inter, sans-serif;">
                  <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Maximize room utilization
                </span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="optimizationSettings.goals"
                  type="checkbox"
                  value="teacher-workload"
                  class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <span class="ml-3 text-sm text-gray-700 flex items-center" style="font-family: Inter, sans-serif;">
                  <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Balance teacher workload
                </span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="optimizationSettings.goals"
                  type="checkbox"
                  value="energy-costs"
                  class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <span class="ml-3 text-sm text-gray-700 flex items-center" style="font-family: Inter, sans-serif;">
                  <svg class="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Reduce energy costs
                </span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="optimizationSettings.goals"
                  type="checkbox"
                  value="equipment-usage"
                  class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <span class="ml-3 text-sm text-gray-700 flex items-center" style="font-family: Inter, sans-serif;">
                  <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Optimize equipment usage
                </span>
              </label>
            </div>
          </div>

          <button
            @click="savePreferences"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            style="font-family: Inter, sans-serif;"
          >
            Save Preferences
          </button>
        </div>

        <!-- Smart Suggestions Widget -->
        <div class="bg-white shadow-md rounded-xl p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center" style="font-family: Inter, sans-serif;">
            <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Smart Suggestions
          </h3>
          <div class="space-y-3">
            <div
              v-for="suggestion in smartSuggestions"
              :key="suggestion.id"
              class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
              @click="applySuggestion(suggestion)"
            >
              <div class="flex items-start">
                <span class="text-lg mr-3">{{ suggestion.icon }}</span>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900" style="font-family: Inter, sans-serif;">{{ suggestion.title }}</p>
                  <p class="text-xs text-gray-600 mt-1" style="font-family: Inter, sans-serif;">{{ suggestion.description }}</p>
                  <div class="flex items-center mt-2">
                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full" style="font-family: Inter, sans-serif;">
                      {{ suggestion.impact }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Optimization Tips -->
        <div class="bg-white shadow-md rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center" style="font-family: Inter, sans-serif;">
            <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Optimization Tips
          </h3>
          <div class="bg-winschool-primary rounded-lg p-4">
            <p class="text-sm text-gray-800" style="font-family: Inter, sans-serif;">
              {{ currentTip.text }}
            </p>
            <div class="flex items-center justify-between mt-3">
              <span class="text-xs text-gray-600" style="font-family: Inter, sans-serif;">
                Tip {{ currentTipIndex + 1 }} of {{ optimizationTips.length }}
              </span>
              <button
                @click="nextTip"
                class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                style="font-family: Inter, sans-serif;"
              >
                Next Tip →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Results Area -->
      <div class="lg:col-span-8">
        <!-- Historical Insights -->
        <div class="bg-white shadow-md rounded-xl p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center" style="font-family: Inter, sans-serif;">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Historical Insights - Last 5 Optimization Runs
          </h3>
          <div class="grid grid-cols-5 gap-4">
            <div
              v-for="(run, index) in historicalRuns"
              :key="index"
              class="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="text-xs text-gray-600 mb-1" style="font-family: Inter, sans-serif;">{{ run.date }}</div>
              <div class="text-lg font-bold text-blue-600 mb-1" style="font-family: Inter, sans-serif;">{{ run.improvement }}%</div>
              <div class="text-xs text-gray-600 mb-1" style="font-family: Inter, sans-serif;">€{{ run.savings.toLocaleString() }}</div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  :style="{ width: run.improvement + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Conflict Alerts -->
        <div v-if="conflictAlerts.length > 0" class="bg-white shadow-md rounded-xl p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center" style="font-family: Inter, sans-serif;">
            <svg class="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Conflict Alerts
          </h3>
          <div class="space-y-3">
            <div
              v-for="alert in conflictAlerts"
              :key="alert.id"
              class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start"
            >
              <svg class="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-red-800" style="font-family: Inter, sans-serif;">{{ alert.message }}</p>
                <p class="text-xs text-red-600 mt-1" style="font-family: Inter, sans-serif;">{{ alert.details }}</p>
              </div>
              <button
                @click="resolveAlert(alert.id)"
                class="text-xs text-red-600 hover:text-red-800 font-medium ml-3"
                style="font-family: Inter, sans-serif;"
              >
                Resolve
              </button>
            </div>
          </div>
        </div>

        <!-- Optimization Results -->
        <div class="bg-white shadow-md rounded-xl p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900" style="font-family: Inter, sans-serif;">Current Optimization Results</h2>
            <span class="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full" style="font-family: Inter, sans-serif;">
              Ready
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="result in optimizationResults"
              :key="result.id"
              class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2" style="font-family: Inter, sans-serif;">{{ result.title }}</h3>
                  <p class="text-sm text-gray-600" style="font-family: Inter, sans-serif;">{{ result.description }}</p>
                </div>
                <span
                  :class="getPriorityBadgeClass(result.priority)"
                  class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-3"
                  style="font-family: Inter, sans-serif;"
                >
                  {{ result.priority }}
                </span>
              </div>

              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="text-center">
                  <div class="text-xs text-gray-600 mb-1" style="font-family: Inter, sans-serif;">Improvement</div>
                  <div class="relative w-12 h-12 mx-auto mb-2">
                    <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        stroke-width="2"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10B981"
                        stroke-width="2"
                        :stroke-dasharray="`${result.improvementPercent}, 100`"
                      />
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="text-xs font-semibold text-gray-700" style="font-family: Inter, sans-serif;">{{ result.improvementPercent }}%</span>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-600 mb-1" style="font-family: Inter, sans-serif;">Savings</div>
                  <div class="flex items-center justify-center mb-2">
                    <svg class="w-4 h-4 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div class="text-sm font-semibold text-gray-900" style="font-family: Inter, sans-serif;">{{ result.savings }}</div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-600 mb-1" style="font-family: Inter, sans-serif;">Status</div>
                  <span
                    :class="getStatusBadgeClass(result.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    style="font-family: Inter, sans-serif;"
                  >
                    {{ result.status }}
                  </span>
                </div>
              </div>

              <div class="flex gap-2">
                <button
                  @click="implementResult(result)"
                  :disabled="result.status === 'In Progress'"
                  class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style="font-family: Inter, sans-serif;"
                >
                  {{ result.status === 'In Progress' ? 'Implementing...' : 'Implement' }}
                </button>
                <button
                  @click="showResultDetails(result)"
                  class="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  style="font-family: Inter, sans-serif;"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Result Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-900" style="font-family: Inter, sans-serif;">{{ selectedResult?.title }}</h3>
              <p class="text-gray-600 mt-2" style="font-family: Inter, sans-serif;">{{ selectedResult?.description }}</p>
            </div>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2" style="font-family: Inter, sans-serif;">Implementation Steps</h4>
              <ol class="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li v-for="step in selectedResult?.implementationSteps" :key="step" style="font-family: Inter, sans-serif;">{{ step }}</li>
              </ol>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2" style="font-family: Inter, sans-serif;">Expected Benefits</h4>
              <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li v-for="benefit in selectedResult?.benefits" :key="benefit" style="font-family: Inter, sans-serif;">{{ benefit }}</li>
              </ul>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button 
              @click="showDetailsModal = false"
              class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              Close
            </button>
            <button 
              @click="implementResult(selectedResult); showDetailsModal = false"
              class="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              Implement Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State Management
const isOptimizing = ref(false)
const showDetailsModal = ref(false)
const selectedResult = ref<any>(null)
const currentTipIndex = ref(0)

// Optimization Settings
const optimizationSettings = reactive({
  priority: 'efficiency',
  timePeriod: 'this-week',
  goals: ['room-utilization', 'teacher-workload', 'energy-costs']
})

// Mock Data for Optimization Stats
const optimizationStats = ref({
  roomUtilization: 87,
  roomUtilizationChange: 12,
  teacherUtilization: 92,
  teacherUtilizationChange: 8,
  costSavings: 15200,
  costSavingsChange: 3100,
  efficiencyGain: 23,
  efficiencyGainChange: 5
})

// Historical Optimization Runs
const historicalRuns = ref([
  { date: 'Nov 15', improvement: 18, savings: 2400 },
  { date: 'Nov 08', improvement: 22, savings: 2800 },
  { date: 'Nov 01', improvement: 15, savings: 1900 },
  { date: 'Oct 25', improvement: 25, savings: 3200 },
  { date: 'Oct 18', improvement: 20, savings: 2650 }
])

// Conflict Alerts
const conflictAlerts = ref([
  {
    id: 1,
    message: 'Teacher Mike is overbooked 12 hours this week',
    details: 'Current workload: 32 hours/week (recommended: 20-25 hours/week)'
  },
  {
    id: 2,
    message: 'Room Lab-C has scheduling conflicts on Thursday',
    details: 'Chemistry and Biology classes overlap from 14:00-16:00'
  }
])

// Smart Suggestions
const smartSuggestions = ref([
  {
    id: 1,
    icon: '🏫',
    title: 'Use Room 103 instead of Lab B on Thursdays',
    description: 'Switch Biology lab sessions to optimize equipment usage',
    impact: '+12% efficiency'
  },
  {
    id: 2,
    icon: '👨‍🏫',
    title: 'Balance Chemistry teacher load with Biology',
    description: 'Redistribute 4 hours/week to improve teacher satisfaction',
    impact: '€800/month saved'
  },
  {
    id: 3,
    icon: '⚡',
    title: 'Schedule energy-intensive classes during off-peak hours',
    description: 'Move lab sessions to 9-11 AM for 15% energy savings',
    impact: '€450/month saved'
  }
])

// Optimization Tips
const optimizationTips = ref([
  { text: 'Merging smaller classes saves up to €1,000/month on heating and maintenance costs.' },
  { text: 'Consider switching Lab A usage to off-peak hours for 20% energy savings.' },
  { text: 'Balanced teacher workloads improve job satisfaction by 35% and reduce turnover.' },
  { text: 'Equipment sharing protocols can increase utilization by up to 40%.' },
  { text: 'Room consolidation during low-occupancy periods saves €500-800/month per room.' }
])

// Current optimization tip
const currentTip = computed(() => optimizationTips.value[currentTipIndex.value])

// Optimization Results with detailed mock data
const optimizationResults = ref([
  {
    id: 1,
    title: 'Room Consolidation Opportunity',
    description: 'Merge 3 underutilized classrooms into 2 optimized spaces',
    priority: 'High',
    improvementPercent: 15,
    savings: '€2,400/month',
    status: 'Ready',
    implementationSteps: [
      'Analyze current room usage patterns',
      'Identify peak and off-peak time slots',
      'Consolidate classes in adjacent rooms',
      'Update room assignment system',
      'Monitor usage for 2 weeks'
    ],
    benefits: [
      'Reduced heating and maintenance costs',
      'Improved space utilization efficiency',
      'Better resource allocation',
      'Simplified cleaning schedules'
    ]
  },
  {
    id: 2,
    title: 'Teacher Schedule Balancing',
    description: 'Redistribute classes to balance workload across teachers',
    priority: 'Medium',
    improvementPercent: 8,
    savings: '12 hours/week',
    status: 'In Progress',
    implementationSteps: [
      'Assess current teacher workloads',
      'Identify overloaded and underutilized teachers',
      'Redistribute subject assignments',
      'Update teacher schedules',
      'Implement gradual transition'
    ],
    benefits: [
      'Improved teacher job satisfaction',
      'Reduced overtime costs',
      'Better work-life balance',
      'Lower teacher turnover'
    ]
  },
  {
    id: 3,
    title: 'Energy Shift Optimization',
    description: 'Move energy-intensive activities to off-peak hours',
    priority: 'High',
    improvementPercent: 10,
    savings: '€1,800/month',
    status: 'Pending',
    implementationSteps: [
      'Identify energy-intensive equipment and classes',
      'Analyze utility rate schedules',
      'Reschedule lab sessions to off-peak hours',
      'Update facility usage guidelines',
      'Track energy consumption changes'
    ],
    benefits: [
      'Significant energy cost reduction',
      'Lower carbon footprint',
      'More efficient grid usage',
      'Potential utility rebates'
    ]
  },
  {
    id: 4,
    title: 'Equipment Sharing Protocol',
    description: 'Implement shared equipment scheduling system',
    priority: 'Low',
    improvementPercent: 25,
    savings: '€5,000/year',
    status: 'Ready',
    implementationSteps: [
      'Catalog all shareable equipment',
      'Develop booking system',
      'Train staff on new protocols',
      'Implement cross-department sharing',
      'Monitor utilization rates'
    ],
    benefits: [
      'Reduced equipment purchase needs',
      'Higher equipment utilization',
      'Better interdepartmental collaboration',
      'Cost-effective resource management'
    ]
  }
])

// Utility Methods
const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'Low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Ready':
      return 'bg-green-100 text-green-800'
    case 'In Progress':
      return 'bg-blue-100 text-blue-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Action Methods
const runOptimization = async () => {
  isOptimizing.value = true
  
  try {
    // Simulate AI optimization process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Update stats with new optimization results
    optimizationStats.value = {
      roomUtilization: Math.min(95, optimizationStats.value.roomUtilization + Math.floor(Math.random() * 8)),
      roomUtilizationChange: Math.floor(Math.random() * 15) + 5,
      teacherUtilization: Math.min(98, optimizationStats.value.teacherUtilization + Math.floor(Math.random() * 6)),
      teacherUtilizationChange: Math.floor(Math.random() * 12) + 3,
      costSavings: optimizationStats.value.costSavings + Math.floor(Math.random() * 5000) + 1000,
      costSavingsChange: Math.floor(Math.random() * 2000) + 1000,
      efficiencyGain: Math.min(35, optimizationStats.value.efficiencyGain + Math.floor(Math.random() * 8)),
      efficiencyGainChange: Math.floor(Math.random() * 10) + 2
    }
    
    // Add new historical run
    const today = new Date()
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    historicalRuns.value.unshift({
      date: dateStr,
      improvement: Math.floor(Math.random() * 15) + 10,
      savings: Math.floor(Math.random() * 2000) + 1500
    })
    
    // Keep only last 5 runs
    if (historicalRuns.value.length > 5) {
      historicalRuns.value.pop()
    }
    
    console.log('Optimization completed successfully')
  } catch (error) {
    console.error('Optimization failed:', error)
  } finally {
    isOptimizing.value = false
  }
}

const exportReport = () => {
  console.log('Exporting optimization report...')
  
  // Create and download CSV
  const csvContent = [
    'Resource Optimization Report',
    `Generated: ${new Date().toLocaleString()}`,
    '',
    'Current Statistics:',
    `Room Utilization,${optimizationStats.value.roomUtilization}%`,
    `Teacher Utilization,${optimizationStats.value.teacherUtilization}%`,
    `Cost Savings,€${optimizationStats.value.costSavings.toLocaleString()}`,
    `Efficiency Gain,${optimizationStats.value.efficiencyGain}%`,
    '',
    'Optimization Results:',
    'Title,Priority,Improvement,Savings,Status',
    ...optimizationResults.value.map(result => 
      `"${result.title}",${result.priority},${result.improvementPercent}%,"${result.savings}",${result.status}`
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `resource-optimization-report-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const implementResult = async (result: any) => {
  console.log('Implementing optimization:', result.title)
  
  if (result.status === 'In Progress') {
    return
  }
  
  // Update result status to In Progress
  const resultIndex = optimizationResults.value.findIndex(r => r.id === result.id)
  if (resultIndex !== -1) {
    optimizationResults.value[resultIndex].status = 'In Progress'
  }
  
  // Simulate implementation process
  setTimeout(() => {
    if (resultIndex !== -1) {
      optimizationResults.value[resultIndex].status = 'Completed'
    }
    console.log('Implementation completed:', result.title)
  }, 5000)
}

const showResultDetails = (result: any) => {
  selectedResult.value = result
  showDetailsModal.value = true
}

const savePreferences = () => {
  console.log('Saving optimization preferences:', optimizationSettings)
  // In a real app, this would save to backend
  alert('Optimization preferences saved successfully!')
}

const applySuggestion = (suggestion: any) => {
  console.log('Applying suggestion:', suggestion.title)
  alert(`Applied suggestion: ${suggestion.title}`)
  
  // Remove applied suggestion
  const index = smartSuggestions.value.findIndex(s => s.id === suggestion.id)
  if (index !== -1) {
    smartSuggestions.value.splice(index, 1)
  }
}

const resolveAlert = (alertId: number) => {
  const index = conflictAlerts.value.findIndex(alert => alert.id === alertId)
  if (index !== -1) {
    conflictAlerts.value.splice(index, 1)
    console.log('Alert resolved:', alertId)
  }
}

const nextTip = () => {
  currentTipIndex.value = (currentTipIndex.value + 1) % optimizationTips.value.length
}

// Lifecycle
onMounted(() => {
  console.log('Resource Optimization View mounted')
  
  // Auto-cycle tips every 30 seconds
  setInterval(() => {
    nextTip()
  }, 30000)
})
</script>

<style scoped>
/* Custom animations and transitions */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes progressFill {
  from {
    width: 0%;
  }
  to {
    width: var(--target-width);
  }
}

/* Base animations */
.resource-optimization {
  animation: fadeInUp 0.6s ease-out;
}

/* Metric cards animations */
.grid > div {
  animation: slideInLeft 0.6s ease-out;
}

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
.grid > div:nth-child(4) { animation-delay: 0.4s; }

/* Card hover effects */
.hover\:shadow-lg:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.hover\:shadow-md:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

/* Button hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.hover\:bg-gray-200:hover {
  background-color: #e5e7eb;
}

/* Progress ring animations */
.progress-ring {
  transition: stroke-dasharray 0.6s ease-in-out;
}

/* Historical runs progress bars */
.bg-blue-600 {
  animation: progressFill 1s ease-out;
}

/* Smart suggestions hover effect */
.cursor-pointer:hover {
  animation: pulse 0.6s ease-in-out;
}

/* Modal animations */
.fixed.inset-0 {
  animation: fadeInUp 0.3s ease-out;
}

.fixed.inset-0 > div {
  animation: slideInLeft 0.4s ease-out;
}

/* Badge styles */
.rounded-full {
  font-weight: 500;
  letter-spacing: 0.025em;
}

/* Icon animations */
svg {
  transition: all 0.2s ease-in-out;
}

.hover\:text-gray-600:hover svg,
.hover\:text-indigo-800:hover svg,
.hover\:text-red-800:hover svg {
  transform: scale(1.1);
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Gradient button animations */
.bg-gradient-to-r {
  background-size: 200% 200%;
  transition: all 0.3s ease;
}

.bg-gradient-to-r:hover {
  background-position: right center;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
}

/* Focus states */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.5);
}

.focus\:ring-purple-500:focus {
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.5);
}

/* Custom scrollbar for overflow areas */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive design enhancements */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-4 {
    gap: 1rem;
  }
  
  .grid-cols-1.md\:grid-cols-2 {
    gap: 1rem;
  }
  
  .text-3xl {
    font-size: 1.875rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
  
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .p-6 {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .grid-cols-5 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }
  
  .flex.items-center.space-x-3 {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .flex.items-center.space-x-3 > * {
    margin-left: 0 !important;
  }
}

/* Enhanced typography */
[style*="font-family: Inter"] {
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  font-optical-sizing: auto;
}

/* Alert styling enhancements */
.bg-red-50 {
  background-image: linear-gradient(to right, #fef2f2, #fee2e2);
}

.border-red-200 {
  border-color: #fecaca;
}

/* Tips section styling */
.bg-gradient-to-r.from-yellow-50.to-orange-50 {
  background-image: linear-gradient(to right, #fffbeb, #fff7ed);
  border: 1px solid #fed7aa;
}

/* Settings section enhancements */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Checkbox styling */
input[type="checkbox"] {
  border-radius: 0.25rem;
}

input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
}

/* Progress bar animations for historical data */
.transition-all.duration-500 {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Card border enhancements */
.border-gray-200 {
  border-color: #e5e7eb;
}

.hover\:border-gray-300:hover {
  border-color: #d1d5db;
}

/* Status badge positioning */
.whitespace-nowrap {
  white-space: nowrap;
  min-width: fit-content;
}

/* Modal backdrop */
.bg-gray-600.bg-opacity-50 {
  backdrop-filter: blur(4px);
}

/* Enhanced shadows */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Grid responsive helpers */
.lg\:col-span-4 {
  grid-column: span 4 / span 4;
}

.lg\:col-span-8 {
  grid-column: span 8 / span 8;
}

.lg\:col-span-12 {
  grid-column: span 12 / span 12;
}

@media (max-width: 1024px) {
  .lg\:col-span-4,
  .lg\:col-span-8,
  .lg\:col-span-12 {
    grid-column: span 1 / span 1;
  }
}

/* Enhanced disabled states */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

/* Print styles */
@media print {
  .bg-gray-50 {
    background-color: white !important;
  }
  
  .shadow-md,
  .shadow-lg,
  .shadow-xl {
    box-shadow: none !important;
  }
  
  .rounded-xl,
  .rounded-lg {
    border-radius: 0 !important;
  }
  
  .bg-gradient-to-r {
    background: white !important;
    border: 1px solid #ccc !important;
    color: black !important;
  }
  
  .fixed.inset-0 {
    display: none !important;
  }
}

/* Accessibility enhancements */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-gray-200 {
    border-color: #000;
    border-width: 2px;
  }
  
  .text-gray-600 {
    color: #000;
  }
  
  .bg-gray-50 {
    background-color: #fff;
  }
}

/* Focus visible for better keyboard navigation */
.focus-visible\:ring-2:focus-visible {
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.5);
}
</style>
