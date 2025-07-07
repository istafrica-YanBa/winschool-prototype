<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RuneBreadcrumbs } from '@ist/commonui-components'

const router = useRouter()
const activeTab = ref('books')

const tabs = [
  { id: 'books', label: 'Book Inventory', route: '/dashboard/library/books' },
  { id: 'student-lending', label: 'Student Lending', route: '/dashboard/library/student-lending' },
  { id: 'class-lending', label: 'Class Lending', route: '/dashboard/library/class-lending' },
  { id: 'course-lending', label: 'Course Lending', route: '/dashboard/library/course-lending' },
  { id: 'fees', label: 'Library Fees', route: '/dashboard/library/fees' },
  { id: 'reservations', label: 'Reservations', route: '/dashboard/library/reservations' }
]

const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
  const tab = tabs.find(t => t.id === tabId)
  if (tab) {
    router.push(tab.route)
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <RuneBreadcrumbs
      truncate
      max-width=""
      :items="[{ label: 'Home', href: '/dashboard' }, { label: 'Library', href: '/dashboard/library' }]"
    />
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h1 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Library Management</h1>
      
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
            @click="handleTabChange(tab.id)"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div class="mt-4">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply text-primary-600;
}
</style> 