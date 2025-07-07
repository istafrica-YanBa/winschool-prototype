<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ isEdit 
        ? (language === 'de' ? 'Korrespondenznotiz bearbeiten' : 'Edit Correspondence Note') 
        : (language === 'de' ? 'Korrespondenznotiz hinzufügen' : 'Add Correspondence Note') }}
    </h3>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Datum' : 'Date' }}*
        </label>
        <input 
          v-model="formData.date" 
          type="date" 
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Vorlage' : 'Template' }}*
        </label>
        <select 
          v-model="formData.template" 
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{{ language === 'de' ? 'Vorlage wählen' : 'Select Template' }}</option>
          <option v-for="template in availableTemplates" :key="template" :value="template">{{ template }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Kommentar' : 'Comment' }}*
        </label>
        <textarea 
          v-model="formData.comment" 
          rows="4"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Erstellt von' : 'Created By' }}
        </label>
        <input 
          v-model="formData.createdBy" 
          type="text"
          :disabled="isEdit"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          :class="{ 'opacity-75 cursor-not-allowed': isEdit }"
        />
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

interface NoteData {
  id: string
  date: string
  template: string
  comment: string
  createdBy: string
}

const props = defineProps({
  noteData: {
    type: Object as () => NoteData,
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

const availableTemplates = [
  language.value === 'de' ? 'Aufnahmebestätigung' : 'Admission Confirmation',
  language.value === 'de' ? 'Zahlungserinnerung' : 'Payment Reminder',
  language.value === 'de' ? 'Verhaltenswarnung' : 'Behavior Warning',
  language.value === 'de' ? 'Leistungsbenachrichtigung' : 'Performance Notification',
  language.value === 'de' ? 'Elterngespräch' : 'Parent Conference',
  language.value === 'de' ? 'Abwesenheitsbenachrichtigung' : 'Absence Notification',
  language.value === 'de' ? 'Allgemeine Korrespondenz' : 'General Correspondence'
]

const formData = ref<NoteData>({
  id: '',
  date: new Date().toISOString().split('T')[0],
  template: '',
  comment: '',
  createdBy: 'System'
})

onMounted(() => {
  if (props.isEdit && props.noteData) {
    formData.value = { ...props.noteData }
  }
})

const submitForm = () => {
  emit('submit', { ...formData.value })
}
</script>