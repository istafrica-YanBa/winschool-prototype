<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="font-medium text-gray-900 dark:text-white">
        {{ language === 'de' ? 'Schullaufbahn' : 'School Career' }}
      </h3>
      <button @click="$emit('add')" class="btn-primary text-sm">
        <Plus class="h-4 w-4 mr-2 inline-block" />
        {{ language === 'de' ? 'Eintrag hinzufügen' : 'Add Entry' }}
      </button>
    </div>

    <div v-if="careerEntries.length === 0" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
      <p class="text-gray-500 dark:text-gray-400">
        {{ language === 'de' ? 'Keine Schullaufbahneinträge vorhanden' : 'No school career entries available' }}
      </p>
    </div>

    <div v-else class="relative">
      <!-- Timeline line -->
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
      
      <!-- Timeline entries -->
      <div class="space-y-6">
        <div v-for="entry in sortedEntries" :key="entry.id" class="relative flex items-start">
          <div :class="getEntryTypeColor(entry.type)" class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center">
            <component :is="getEntryTypeIcon(entry.type)" class="h-4 w-4 text-white" />
          </div>
          <div class="ml-4 flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ entry.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ entry.description }}</p>
                <div class="flex space-x-4 mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-500">{{ entry.date }}</span>
                  <span :class="getEntryTypeTextColor(entry.type)" class="text-xs font-medium">
                    {{ entry.type }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2">
                <button @click="$emit('edit', entry)" class="text-primary-600 hover:text-primary-800">
                  <Edit class="h-4 w-4" />
                </button>
                <button @click="$emit('remove', entry)" class="text-red-600 hover:text-red-800">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div class="text-sm">
                <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Von:' : 'From:' }}</span>
                <span class="font-medium text-gray-900 dark:text-white ml-1">{{ entry.fromGrade }}</span>
              </div>
              <div class="text-sm">
                <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Nach:' : 'To:' }}</span>
                <span class="font-medium text-gray-900 dark:text-white ml-1">{{ entry.toGrade }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Repeat, GraduationCap, AlertTriangle } from 'lucide-vue-next'

interface CareerEntry {
  id: string
  title: string
  type: string
  date: string
  fromGrade: string
  toGrade: string
  description: string
  reason: string
  isVoluntary: boolean
}

const props = defineProps({
  careerEntries: {
    type: Array as () => CareerEntry[],
    required: true,
    default: () => []
  }
})

defineEmits(['add', 'edit', 'remove'])

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const sortedEntries = computed(() => {
  return [...props.careerEntries].sort((a: CareerEntry, b: CareerEntry) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

const getEntryTypeColor = (type: string) => {
  switch (type) {
    case 'Promotion':
      return 'bg-green-600'
    case 'Retention':
      return 'bg-red-600'
    case 'Transfer':
      return 'bg-blue-600'
    case 'Graduation':
      return 'bg-purple-600'
    default:
      return 'bg-gray-600'
  }
}

const getEntryTypeTextColor = (type: string) => {
  switch (type) {
    case 'Promotion':
      return 'text-green-600'
    case 'Retention':
      return 'text-red-600'
    case 'Transfer':
      return 'text-blue-600'
    case 'Graduation':
      return 'text-purple-600'
    default:
      return 'text-gray-600'
  }
}

const getEntryTypeIcon = (type: string) => {
  switch (type) {
    case 'Promotion':
      return ArrowUp
    case 'Retention':
      return Repeat
    case 'Transfer':
      return ArrowDown
    case 'Graduation':
      return GraduationCap
    default:
      return AlertTriangle
  }
}
</script>