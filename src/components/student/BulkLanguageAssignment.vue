<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ language === 'de' ? 'Sprachen zuweisen' : 'Assign Languages' }}
    </h3>
    <p class="text-gray-600 dark:text-gray-400">
      {{ language === 'de' 
        ? `Diese Aktion wird ${selectedStudents.length} ausgewählten Schülern Sprachen zuweisen.` 
        : `This action will assign languages to ${selectedStudents.length} selected students.` }}
    </p>

    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-start">
        <InfoIcon class="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
        <p class="text-sm text-blue-600 dark:text-blue-300">
          {{ language === 'de' 
            ? 'Bestehende Sprachzuweisungen werden nicht überschrieben. Neue Sprachen werden hinzugefügt.' 
            : 'Existing language assignments will not be overwritten. New languages will be added.' }}
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="(languageEntry, index) in languageEntries" :key="index" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="flex justify-between items-start mb-4">
          <h4 class="font-medium text-gray-900 dark:text-white">
            {{ language === 'de' ? `Sprache ${index + 1}` : `Language ${index + 1}` }}
          </h4>
          <button v-if="languageEntries.length > 1" @click="removeLanguageEntry(index)" class="text-red-600 hover:text-red-800">
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Sprache' : 'Language' }}*
            </label>
            <select 
              v-model="languageEntry.name" 
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
              v-model="languageEntry.level" 
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
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Typ' : 'Type' }}*
            </label>
            <select 
              v-model="languageEntry.type" 
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
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Unterrichtet seit' : 'Taught Since' }}*
            </label>
            <input 
              v-model="languageEntry.since" 
              type="date" 
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <button @click="addLanguageEntry" class="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 flex items-center justify-center">
        <Plus class="h-5 w-5 mr-2" />
        {{ language === 'de' ? 'Weitere Sprache hinzufügen' : 'Add Another Language' }}
      </button>
    </div>

    <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ language === 'de' 
            ? `${selectedStudents.length} Schüler ausgewählt` 
            : `${selectedStudents.length} students selected` }}
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="$emit('cancel')" class="btn-secondary">
          {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
        </button>
        <button @click="applyToAll" class="btn-primary">
          {{ language === 'de' ? 'Auf alle anwenden' : 'Apply to All' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Plus, Trash2, Info as InfoIcon } from 'lucide-vue-next'

const props = defineProps({
  selectedStudents: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel'])

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const languageEntries = ref([
  {
    name: '',
    level: '',
    type: '',
    since: '',
    until: '',
    knowledgeLevel: 0,
    notes: ''
  }
])

const selectedLanguages = ref<string[]>([])
const selectedLevel = ref('')
const selectedType = ref('')
const startDate = ref('')
const endDate = ref('')
const notes = ref('')

const availableLanguages = [
  'English', 'German', 'French', 'Spanish', 'Italian', 'Russian', 
  'Chinese', 'Japanese', 'Arabic', 'Portuguese', 'Dutch', 'Swedish'
]

const addLanguageEntry = () => {
  languageEntries.value.push({
    name: '',
    level: '',
    type: '',
    since: '',
    until: '',
    knowledgeLevel: 0,
    notes: ''
  })
}

const removeLanguageEntry = (index: number) => {
  languageEntries.value.splice(index, 1)
}

const applyToAll = () => {
  if (selectedLanguages.value.length === 0) {
    alert(language.value === 'de' ? 'Bitte wählen Sie mindestens eine Sprache aus.' : 'Please select at least one language.')
    return
  }
  
  if (!selectedLevel.value) {
    alert(language.value === 'de' ? 'Bitte wählen Sie ein Niveau aus.' : 'Please select a proficiency level.')
    return
  }
  
  if (!selectedType.value) {
    alert(language.value === 'de' ? 'Bitte wählen Sie einen Typ aus.' : 'Please select a language type.')
    return
  }
  
  if (!startDate.value) {
    alert(language.value === 'de' ? 'Bitte wählen Sie ein Startdatum aus.' : 'Please select a start date.')
    return
  }
  
  emit('submit', {
    students: props.selectedStudents,
    languages: selectedLanguages.value,
    level: selectedLevel.value,
    type: selectedType.value,
    startDate: startDate.value,
    endDate: endDate.value,
    notes: notes.value
  })
}
</script>