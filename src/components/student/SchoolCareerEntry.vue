<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ isEdit 
        ? (language === 'de' ? 'Schullaufbahneintrag bearbeiten' : 'Edit School Career Entry') 
        : (language === 'de' ? 'Schullaufbahneintrag hinzufügen' : 'Add School Career Entry') }}
    </h3>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Titel' : 'Title' }}*
        </label>
        <input 
          v-model="formData.title" 
          type="text" 
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
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
          <option value="Promotion">{{ language === 'de' ? 'Versetzung' : 'Promotion' }}</option>
          <option value="Retention">{{ language === 'de' ? 'Wiederholung' : 'Retention' }}</option>
          <option value="Transfer">{{ language === 'de' ? 'Schulwechsel' : 'Transfer' }}</option>
          <option value="Graduation">{{ language === 'de' ? 'Abschluss' : 'Graduation' }}</option>
          <option value="Other">{{ language === 'de' ? 'Sonstiges' : 'Other' }}</option>
        </select>
      </div>

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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Von Klasse/Stufe' : 'From Grade/Level' }}*
          </label>
          <input 
            v-model="formData.fromGrade" 
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Nach Klasse/Stufe' : 'To Grade/Level' }}*
          </label>
          <input 
            v-model="formData.toGrade" 
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Beschreibung' : 'Description' }}
        </label>
        <textarea 
          v-model="formData.description" 
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ language === 'de' ? 'Grund' : 'Reason' }}
        </label>
        <input 
          v-model="formData.reason" 
          type="text"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div class="flex items-center">
        <input 
          id="voluntary" 
          v-model="formData.isVoluntary" 
          type="checkbox" 
          class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
        />
        <label for="voluntary" class="text-sm text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Freiwillige Wiederholung' : 'Voluntary Repetition' }}
        </label>
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

interface CareerEntryData {
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
  careerEntryData: {
    type: Object as () => CareerEntryData,
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

const formData = ref<CareerEntryData>({
  id: '',
  title: '',
  type: '',
  date: '',
  fromGrade: '',
  toGrade: '',
  description: '',
  reason: '',
  isVoluntary: false
})

onMounted(() => {
  if (props.isEdit && props.careerEntryData) {
    formData.value = { ...props.careerEntryData }
  }
})

const submitForm = () => {
  emit('submit', { ...formData.value })
}
</script>