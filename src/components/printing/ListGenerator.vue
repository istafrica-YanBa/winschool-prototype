<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ language === 'de' ? 'Listengenerator' : 'List Generator' }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Left Panel: Fields -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3">
          {{ language === 'de' ? 'Verfügbare Felder' : 'Available Fields' }}
        </h4>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div 
            v-for="field in availableFields" 
            :key="field.id"
            class="p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 cursor-move"
            draggable="true"
            @dragstart="dragStart($event, field)"
          >
            {{ field.name }}
          </div>
        </div>
      </div>

      <!-- Middle Panel: Design -->
      <div class="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3">
          {{ language === 'de' ? 'Listendesign' : 'List Design' }}
        </h4>
        <div 
          class="bg-white dark:bg-gray-600 rounded-lg p-4 min-h-96 border-2 border-dashed border-gray-300 dark:border-gray-500"
          @dragover.prevent
          @drop="drop($event)"
        >
          <!-- Design area -->
          <div v-if="selectedFields.length === 0" class="text-center text-gray-500 dark:text-gray-400">
            {{ language === 'de' ? 'Ziehen Sie Felder hierher, um Ihre Liste zu gestalten' : 'Drag fields here to design your list' }}
          </div>
          <div v-else class="space-y-2">
            <div 
              v-for="(field, index) in selectedFields" 
              :key="index"
              class="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-500 flex justify-between items-center"
            >
              <span>{{ field.name }}</span>
              <button @click="removeField(index)" class="text-red-600 hover:text-red-800">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List Properties -->
    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <h4 class="font-medium text-gray-900 dark:text-white mb-3">
        {{ language === 'de' ? 'Listeneigenschaften' : 'List Properties' }}
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Gruppierung' : 'Grouping' }}
          </label>
          <select
            v-model="listProperties.groupBy"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Keine Gruppierung' : 'No Grouping' }}</option>
            <option value="class">{{ language === 'de' ? 'Klasse' : 'Class' }}</option>
            <option value="gender">{{ language === 'de' ? 'Geschlecht' : 'Gender' }}</option>
            <option value="grade">{{ language === 'de' ? 'Note' : 'Grade' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Schriftart' : 'Font' }}
          </label>
          <select
            v-model="listProperties.font"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Calibri">Calibri</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Rahmen' : 'Borders' }}
          </label>
          <select
            v-model="listProperties.borders"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="none">{{ language === 'de' ? 'Keine' : 'None' }}</option>
            <option value="outer">{{ language === 'de' ? 'Nur außen' : 'Outer Only' }}</option>
            <option value="all">{{ language === 'de' ? 'Alle Zellen' : 'All Cells' }}</option>
            <option value="horizontal">{{ language === 'de' ? 'Nur horizontal' : 'Horizontal Only' }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Aggregation Options -->
    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <h4 class="font-medium text-gray-900 dark:text-white mb-3">
        {{ language === 'de' ? 'Aggregationen' : 'Aggregations' }}
      </h4>
      <div class="space-y-3">
        <div class="flex items-center">
          <input
            v-model="listProperties.showCount"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
          />
          <span class="text-sm text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Anzahl der Datensätze anzeigen' : 'Show record count' }}
          </span>
        </div>
        <div class="flex items-center">
          <input
            v-model="listProperties.showAverage"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
          />
          <span class="text-sm text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Durchschnittswerte anzeigen (für numerische Felder)' : 'Show average values (for numeric fields)' }}
          </span>
        </div>
        <div class="flex items-center">
          <input
            v-model="listProperties.showSum"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
          />
          <span class="text-sm text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Summen anzeigen (für numerische Felder)' : 'Show sums (for numeric fields)' }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button @click="$emit('preview')" class="btn-secondary">
        {{ language === 'de' ? 'Vorschau' : 'Preview' }}
      </button>
      <button @click="saveTemplate" class="btn-primary">
        {{ language === 'de' ? 'Speichern' : 'Save' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Trash2 } from 'lucide-vue-next'

const emit = defineEmits(['preview', 'save'])

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Available fields
const availableFields = [
  { id: 'student_id', name: language.value === 'de' ? 'Schüler-ID' : 'Student ID' },
  { id: 'first_name', name: language.value === 'de' ? 'Vorname' : 'First Name' },
  { id: 'last_name', name: language.value === 'de' ? 'Nachname' : 'Last Name' },
  { id: 'class', name: language.value === 'de' ? 'Klasse' : 'Class' },
  { id: 'date_of_birth', name: language.value === 'de' ? 'Geburtsdatum' : 'Date of Birth' },
  { id: 'gender', name: language.value === 'de' ? 'Geschlecht' : 'Gender' },
  { id: 'address', name: language.value === 'de' ? 'Adresse' : 'Address' },
  { id: 'phone', name: language.value === 'de' ? 'Telefon' : 'Phone' },
  { id: 'email', name: language.value === 'de' ? 'E-Mail' : 'Email' },
  { id: 'enrollment_date', name: language.value === 'de' ? 'Eintrittsdatum' : 'Enrollment Date' }
]

// Selected fields
const selectedFields = ref<any[]>([])

// List properties
const listProperties = ref({
  groupBy: '',
  font: 'Arial',
  borders: 'all',
  showCount: true,
  showAverage: false,
  showSum: false
})

// Drag and drop functions
const dragStart = (event: DragEvent, field: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify(field))
  }
}

const drop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    const fieldData = JSON.parse(event.dataTransfer.getData('text/plain'))
    selectedFields.value.push(fieldData)
  }
}

const removeField = (index: number) => {
  selectedFields.value.splice(index, 1)
}

const saveTemplate = () => {
  emit('save', {
    fields: selectedFields.value,
    properties: listProperties.value
  })
}
</script>