<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {{ language === 'de' ? 'Ressourcen-Raum' : 'Resource Room' }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ language === 'de' ? 'Zugang zu Lehr- und Lernressourcen' : 'Access to teaching and learning resources' }}
      </p>
    </div>

    <!-- Coming Soon Notice -->
    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
      <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Key class="h-8 w-8 text-white" />
      </div>
      <h2 class="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
        {{ language === 'de' ? 'Bald verfügbar' : 'Coming Soon' }}
      </h2>
      <p class="text-green-700 dark:text-green-300 max-w-md mx-auto">
        {{ language === 'de' ? 'Der Ressourcen-Zugang wird bald verfügbar sein. Hier können Lehrer auf Unterrichtsmaterialien und digitale Ressourcen zugreifen.' : 'Resource Room Access will be available soon. Teachers will be able to access teaching materials and digital resources here.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Key } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)
</script> 
