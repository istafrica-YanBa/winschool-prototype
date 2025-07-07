<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li 
        v-for="(item, index) in items" 
        :key="index"
        class="inline-flex items-center"
      >
        <div v-if="index > 0" class="flex items-center">
          <span class="mx-2 text-gray-400 dark:text-gray-500">{{ separator }}</span>
        </div>
        
        <router-link
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
        >
          {{ item.label }}
        </router-link>
        
        <a
          v-else-if="item.href && index < items.length - 1"
          :href="item.href"
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
        >
          {{ item.label }}
        </a>
        
        <span
          v-else
          class="text-sm font-medium text-gray-500 dark:text-gray-400"
          aria-current="page"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  items: Array<{
    label: string
    to?: string
    href?: string
  }>
  separator?: string
}

defineProps<Props>()
</script>

<script lang="ts">
export default {
  name: 'Breadcrumb'
}
</script>

<style scoped>
/* Custom styles for breadcrumb if needed */
</style> 