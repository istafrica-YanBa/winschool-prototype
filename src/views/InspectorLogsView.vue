<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {{ (language as any) === 'de' ? 'Inspektoren-Protokolle' : 'Inspector Logs' }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ (language as any) === 'de' ? 'Verwaltung der Bildungsinspektionen und -berichte' : 'Management of educational inspections and reports' }}
      </p>
    </div>

    <!-- Coming Soon Notice -->
    <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-8 text-center">
      <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield class="h-8 w-8 text-white" />
      </div>
      <h2 class="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-2">
        {{ (language as any) === 'de' ? 'Bald verfügbar' : 'Coming Soon' }}
      </h2>
      <p class="text-purple-700 dark:text-purple-300 max-w-md mx-auto">
        {{ (language as any) === 'de' ? 'Die Inspektoren-Protokolle werden bald verfügbar sein. Hier können Inspektoren ihre Berichte erstellen und verwalten.' : 'Inspector Logs will be available soon. Inspectors will be able to create and manage their reports here.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Shield } from 'lucide-vue-next'

const language = 'en' // Assuming a default language or that it's not directly used here
</script> 
