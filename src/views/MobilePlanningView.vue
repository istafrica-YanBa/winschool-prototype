<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Mobile Planung' : 'Mobile Planning' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Responsive Planungstools und Offline-Funktionen' : 'Responsive planning tools and offline capabilities' }}
        </p>
      </div>
      <div class="flex space-x-2">
        <button @click="syncOfflineData" class="btn-secondary flex items-center">
          <RefreshCw class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Offline-Sync' : 'Offline Sync' }}
        </button>
        <button @click="downloadApp" class="btn-primary flex items-center">
          <Download class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'App herunterladen' : 'Download App' }}
        </button>
      </div>
    </div>

    <!-- Rest of template content -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { RefreshCw, Download } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const syncOfflineData = () => {
  console.log('Syncing offline data...')
  alert(language.value === 'de' ? 'Offline-Daten werden synchronisiert...' : 'Syncing offline data...')
}

const downloadApp = () => {
  console.log('Downloading mobile app...')
  alert(language.value === 'de' ? 'Mobile App wird heruntergeladen...' : 'Downloading mobile app...')
}
</script>
