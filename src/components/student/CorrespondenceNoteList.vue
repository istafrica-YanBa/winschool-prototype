<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="font-medium text-gray-900 dark:text-white">
        {{ language === 'de' ? 'Korrespondenznotizen' : 'Correspondence Notes' }}
      </h3>
      <button @click="$emit('add')" class="btn-primary text-sm">
        <Plus class="h-4 w-4 mr-2 inline-block" />
        {{ language === 'de' ? 'Notiz hinzufügen' : 'Add Note' }}
      </button>
    </div>

    <div v-if="notes.length === 0" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
      <p class="text-gray-500 dark:text-gray-400">
        {{ language === 'de' ? 'Keine Korrespondenznotizen vorhanden' : 'No correspondence notes available' }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="note in sortedNotes" :key="note.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center">
              <Mail class="h-4 w-4 text-gray-500 mr-2" />
              <h4 class="font-medium text-gray-900 dark:text-white">{{ note.template }}</h4>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ note.comment }}</p>
            <div class="flex space-x-4 mt-2">
              <span class="text-xs text-gray-500 dark:text-gray-500">{{ note.date }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-500">{{ language === 'de' ? 'Erstellt von:' : 'Created by:' }} {{ note.createdBy }}</span>
            </div>
          </div>
          <div class="flex space-x-2">
            <button @click="$emit('edit', note)" class="text-primary-600 hover:text-primary-800">
              <Edit class="h-4 w-4" />
            </button>
            <button @click="$emit('remove', note)" class="text-red-600 hover:text-red-800">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Plus, Edit, Trash2, Mail } from 'lucide-vue-next'

interface Note {
  id: string
  date: string
  template: string
  comment: string
  createdBy: string
}

const props = defineProps({
  notes: {
    type: Array as () => Note[],
    required: true,
    default: () => []
  }
})

defineEmits(['add', 'edit', 'remove'])

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const sortedNotes = computed(() => {
  return [...props.notes].sort((a: Note, b: Note) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})
</script>