<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ isEdit 
        ? (language === 'de' ? 'Sprache bearbeiten' : 'Edit Language') 
        : (language === 'de' ? 'Sprache hinzufügen' : 'Add Language') }}
    </h3>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Sprache' : 'Language' }}*
        </label>
        <select 
          v-model="formData.name" 
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{{ language === 'de' ? 'Sprache wählen' : 'Select Language' }}</option>
          <option v-for="lang in availableLanguages" :key="lang" :value="lang">{{ lang }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Niveau' : 'Proficiency Level' }}*
        </label>
        <select 
          v-model="formData.level" 
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{{ language === 'de' ? 'Niveau wählen' : 'Select Level' }}</option>
          <option value="A1">A1 - {{ language === 'de' ? 'Anfänger' : 'Beginner' }}</option>
          <option value="A2">A2 - {{ language === 'de' ? 'Grundlegende Kenntnisse' : 'Elementary' }}</option>
          <option value="B1">B1 - {{ language === 'de' ? 'Mittelstufe' : 'Intermediate' }}</option>
          <option value="B2">B2 - {{ language === 'de' ? 'Gute Mittelstufe' : 'Upper Intermediate' }}</option>
          <option value="C1">C1 - {{ language === 'de' ? 'Fortgeschritten' : 'Advanced' }}</option>
          <option value="C2">C2 - {{ language === 'de' ? 'Exzellent' : 'Proficient' }}</option>
          <option value="Native">{{ language === 'de' ? 'Muttersprache' : 'Native' }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Typ' : 'Type' }}*
        </label>
        <select 
          v-model="formData.type" 
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{{ language === 'de' ? 'Typ wählen' : 'Select Type' }}</option>
          <option value="Native">{{ language === 'de' ? 'Muttersprache' : 'Native' }}</option>
          <option value="Elective">{{ language === 'de' ? 'Wahlfach' : 'Elective' }}</option>
          <option value="Early Foreign Language">{{ language === 'de' ? 'Frühe Fremdsprache' : 'Early Foreign Language' }}</option>
          <option value="Required">{{ language === 'de' ? 'Pflichtfach' : 'Required' }}</option>
          <option value="Additional">{{ language === 'de' ? 'Zusätzlich' : 'Additional' }}</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Unterrichtet seit' : 'Taught Since' }}*
          </label>
          <input 
            v-model="formData.since" 
            type="date" 
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Unterrichtet bis' : 'Taught Until' }}
          </label>
          <input 
            v-model="formData.until" 
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Wissensniveau' : 'Knowledge Level' }}
        </label>
        <div class="flex items-center space-x-1">
          <template v-for="i in 5" :key="i">
            <Star 
              @click="formData.knowledgeLevel = i"
              :class="i <= formData.knowledgeLevel ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'"
              class="h-6 w-6 cursor-pointer"
            />
          </template>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Notizen' : 'Notes' }}
        </label>
        <textarea 
          v-model="formData.notes" 
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
        ></textarea>
      </div>

      <div class="flex justify-end space-x-3">
        <button type="button" @click="$emit('cancel')" class="btn-secondary">
          {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
        </button>
        <button type="submit" class="btn-primary">
          {{ isEdit 
            ? (language === 'de' ? 'Aktualisieren' : 'Update') 
            : (language === 'de' ? 'Hinzufügen' : 'Add') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Star } from 'lucide-vue-next'

interface LanguageData {
  id: string
  name: string
  level: string
  type: string
  since: string
  until: string
  knowledgeLevel: number
  notes: string
}

const props = defineProps({
  languageData: {
    type: Object as () => LanguageData,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const availableLanguages = [
  'English',
  'German',
  'French',
  'Spanish',
  'Italian',
  'Russian',
  'Chinese',
  'Japanese',
  'Arabic',
  'Portuguese',
  'Dutch',
  'Swedish',
  'Greek',
  'Turkish',
  'Polish',
  'Korean',
  'Hindi',
  'Latin'
]

const formData = ref<LanguageData>({
  id: '',
  name: '',
  level: '',
  type: '',
  since: '',
  until: '',
  knowledgeLevel: 0,
  notes: ''
})

onMounted(() => {
  if (props.isEdit && props.languageData) {
    formData.value = { ...props.languageData }
  }
})

const submitForm = () => {
  emit('submit', { ...formData.value })
}
</script>