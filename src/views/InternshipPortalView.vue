<template>
  <div class="space-y-6">
    <!-- Breadcrumb Navigation -->
    <RuneBreadcrumbs
      truncate
      max-width=""
      :items="breadcrumbItems"
    />
    
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-slate-500 dark:text-slate-400">
          {{ language === 'de' ? 'Praktikumsportal' : 'Internship Portal' }}
        </h1>
        <p class="text-slate-800 dark:text-slate-200">
          {{ language === 'de' ? 'Praktikumsplätze finden und verwalten' : 'Find and manage internship opportunities' }}
        </p>
      </div>
      <button class="btn-primary flex items-center">
        <Plus class="h-4 w-4 mr-2" />
        {{ language === 'de' ? 'Praktikum hinzufügen' : 'Add Internship' }}
      </button>
    </div>

    <!-- Coming Soon Notice -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
      <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Briefcase class="h-8 w-8 text-white" />
      </div>
      <h2 class="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
        {{ language === 'de' ? 'Bald verfügbar' : 'Coming Soon' }}
      </h2>
      <p class="text-blue-700 dark:text-blue-300 max-w-md mx-auto">
        {{ language === 'de' ? 'Das Praktikumsportal wird bald verfügbar sein. Hier können Schüler Praktikumsplätze suchen und ihre Bewerbungen verwalten.' : 'The Internship Portal will be available soon. Students will be able to search for internship opportunities and manage their applications here.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Plus, Briefcase } from 'lucide-vue-next'
import { RuneBreadcrumbs } from '@ist/commonui-components'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Breadcrumb items for RuneBreadcrumbs
const breadcrumbItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Advanced', href: '/dashboard' },
  { label: 'Internship Portal', href: '' }
]
</script> 
