<template>
  <nav class="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
    <router-link 
      to="/dashboard" 
      class="flex items-center text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
    >
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      Home
    </router-link>
    
    <template v-for="(segment, index) in segments" :key="index">
      <span class="text-slate-400 dark:text-slate-500">/</span>
      <router-link
        v-if="segment.to && index < segments.length - 1"
        :to="segment.to"
        class="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        {{ segment.label }}
      </router-link>
      <span
        v-else
        class="font-bold text-slate-700 dark:text-slate-300"
        style="color: #64748B;"
      >
        {{ segment.label }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbSegment {
  label: string
  to?: string
}

interface Props {
  segments: BreadcrumbSegment[]
}

defineProps<Props>()
</script>

<style scoped>
/* Custom styles for breadcrumb if needed */
</style> 