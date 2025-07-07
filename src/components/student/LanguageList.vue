<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="font-medium text-gray-900 dark:text-white">
        {{ language === 'de' ? 'Sprachkenntnisse' : 'Language Skills' }}
      </h3>
      <button @click="$emit('add')" class="btn-primary text-sm">
        <Plus class="h-4 w-4 mr-2 inline-block" />
        {{ language === 'de' ? 'Sprache hinzufügen' : 'Add Language' }}
      </button>
    </div>

    <div v-if="languages.length === 0" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
      <p class="text-gray-500 dark:text-gray-400">
        {{ language === 'de' ? 'Keine Sprachkenntnisse eingetragen' : 'No language skills recorded' }}
      </p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Sprache' : 'Language' }}
            </th>
            <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Niveau' : 'Level' }}
            </th>
            <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Typ' : 'Type' }}
            </th>
            <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Seit' : 'Since' }}
            </th>
            <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Bis' : 'Until' }}
            </th>
            <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Aktionen' : 'Actions' }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="language in languages" :key="language.id" class="border-b border-gray-100 dark:border-gray-700">
            <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language.name }}</td>
            <td class="py-3 px-4">
              <span :class="getLevelColor(language.level)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ language.level }}
              </span>
            </td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ language.type }}</td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ language.since }}</td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ language.until || '-' }}</td>
            <td class="py-3 px-4">
              <div class="flex space-x-2">
                <button @click="$emit('edit', language)" class="text-primary-600 hover:text-primary-800">
                  <Edit class="h-4 w-4" />
                </button>
                <button @click="$emit('delete', language)" class="text-red-600 hover:text-red-800">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'

const emit = defineEmits(['add', 'edit', 'delete'])

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const languages = ref([
  {
    id: '1',
    name: 'English',
    level: 'B2',
    type: 'Required',
    since: '2020-09-01',
    until: '',
    knowledgeLevel: 4,
    notes: 'Primary foreign language'
  },
  {
    id: '2',
    name: 'French',
    level: 'A2',
    type: 'Elective',
    since: '2021-09-01',
    until: '',
    knowledgeLevel: 2,
    notes: 'Second foreign language'
  }
])

const getLevelColor = (level: string) => {
  switch (level) {
    case 'A1':
    case 'A2':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'B1':
    case 'B2':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'C1':
    case 'C2':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Native':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>