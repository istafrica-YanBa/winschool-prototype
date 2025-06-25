<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ language === 'de' ? 'Individuelle Korrespondenz' : 'Individual Correspondence' }}
    </h3>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ language === 'de' ? 'Empfänger' : 'Recipient' }}
      </label>
      <select
        v-model="selectedRecipient"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">{{ language === 'de' ? 'Empfänger wählen' : 'Select Recipient' }}</option>
        <option v-for="recipient in recipients" :key="recipient.id" :value="recipient.id">{{ recipient.name }}</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ language === 'de' ? 'Vorlage' : 'Template' }}
      </label>
      <select
        v-model="selectedTemplate"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">{{ language === 'de' ? 'Vorlage wählen' : 'Select Template' }}</option>
        <option v-for="template in templates" :key="template.id" :value="template.id">{{ template.name }}</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ language === 'de' ? 'Variablen' : 'Variables' }}
      </label>
      <div class="space-y-3 max-h-60 overflow-y-auto">
        <div v-for="variable in variables" :key="variable.id" class="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
          <div class="md:col-span-1">
            <span class="text-sm text-gray-900 dark:text-white">{{ variable.name }}</span>
          </div>
          <div class="md:col-span-2">
            <input
              v-model="variable.value"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button @click="$emit('cancel')" class="btn-secondary">
        {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
      </button>
      <button @click="createCorrespondence" class="btn-primary">
        {{ language === 'de' ? 'In Word bearbeiten' : 'Edit in Word' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useThemeStore } from '../../stores/theme'

const props = defineProps({
  templates: {
    type: Array,
    default: () => []
  },
  recipients: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['create', 'cancel'])

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Form state
const selectedRecipient = ref('')
const selectedTemplate = ref('')

// Sample variables
const variables = ref([
  { id: 1, name: language.value === 'de' ? 'Betreff' : 'Subject', value: '' },
  { id: 2, name: language.value === 'de' ? 'Datum' : 'Date', value: new Date().toLocaleDateString() },
  { id: 3, name: language.value === 'de' ? 'Veranstaltung' : 'Event', value: '' },
  { id: 4, name: language.value === 'de' ? 'Ort' : 'Location', value: '' }
])

const createCorrespondence = () => {
  if (!selectedRecipient.value || !selectedTemplate.value) {
    alert(language.value === 'de' ? 'Bitte wählen Sie einen Empfänger und eine Vorlage aus.' : 'Please select a recipient and a template.')
    return
  }
  
  emit('create', {
    recipientId: selectedRecipient.value,
    templateId: selectedTemplate.value,
    variables: variables.value
  })
}
</script>