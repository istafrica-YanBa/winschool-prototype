<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ language === 'de' ? 'Vorlagen-Assistent' : 'Template Wizard' }}
    </h3>

    <!-- Wizard Steps -->
    <div class="mb-8">
      <div class="flex justify-between mb-2">
        <div v-for="(step, index) in steps" :key="step.id" class="flex flex-col items-center">
          <div 
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              currentStep >= index 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            ]"
          >
            {{ index + 1 }}
          </div>
          <span class="text-xs mt-1 text-gray-600 dark:text-gray-400">{{ step.name }}</span>
        </div>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
        <div 
          class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
          :style="{ width: `${(currentStep / (steps.length - 1)) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Step 1: Basic Information -->
    <div v-if="currentStep === 0">
      <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
        {{ language === 'de' ? 'Grundinformationen' : 'Basic Information' }}
      </h4>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Vorlagenname' : 'Template Name' }}*
          </label>
          <input
            v-model="templateData.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Vorlagentyp' : 'Template Type' }}*
          </label>
          <select
            v-model="templateData.type"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Typ wählen' : 'Select Type' }}</option>
            <option value="WW">{{ language === 'de' ? 'Word-Vorlage (WW)' : 'Word Template (WW)' }}</option>
            <option value="WS">{{ language === 'de' ? 'Listengenerator (WS)' : 'List Generator (WS)' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Kategorie' : 'Category' }}*
          </label>
          <select
            v-model="templateData.categoryId"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Kategorie wählen' : 'Select Category' }}</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Datensatztyp' : 'Record Type' }}*
          </label>
          <select
            v-model="templateData.recordType"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Typ wählen' : 'Select Type' }}</option>
            <option value="students">{{ language === 'de' ? 'Schüler' : 'Students' }}</option>
            <option value="classes">{{ language === 'de' ? 'Klassen' : 'Classes' }}</option>
            <option value="teachers">{{ language === 'de' ? 'Lehrer' : 'Teachers' }}</option>
            <option value="grades">{{ language === 'de' ? 'Noten' : 'Grades' }}</option>
            <option value="attendance">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Step 2: Template Source -->
    <div v-if="currentStep === 1">
      <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
        {{ language === 'de' ? 'Vorlagenquelle' : 'Template Source' }}
      </h4>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Quelle' : 'Source' }}
          </label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                v-model="templateData.source"
                type="radio"
                value="blank"
                class="text-primary-600 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
              />
              <span class="text-sm text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Leere Vorlage' : 'Blank Template' }}
              </span>
            </label>
            <label class="flex items-center">
              <input
                v-model="templateData.source"
                type="radio"
                value="existing"
                class="text-primary-600 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
              />
              <span class="text-sm text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Bestehende Vorlage kopieren' : 'Copy Existing Template' }}
              </span>
            </label>
            <label class="flex items-center">
              <input
                v-model="templateData.source"
                type="radio"
                value="upload"
                class="text-primary-600 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
              />
              <span class="text-sm text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Datei hochladen' : 'Upload File' }}
              </span>
            </label>
          </div>
        </div>

        <div v-if="templateData.source === 'existing'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Bestehende Vorlage' : 'Existing Template' }}
          </label>
          <select
            v-model="templateData.existingTemplateId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Vorlage wählen' : 'Select Template' }}</option>
            <option v-for="template in templates" :key="template.id" :value="template.id">{{ template.name }}</option>
          </select>
        </div>

        <div v-if="templateData.source === 'upload'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Datei hochladen' : 'Upload File' }}
          </label>
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <div class="flex flex-col items-center justify-center pt-7">
                <Upload class="w-8 h-8 text-gray-400" />
                <p class="pt-1 text-sm text-gray-600 dark:text-gray-400">
                  {{ language === 'de' ? 'Datei hierher ziehen oder klicken' : 'Drag file here or click to upload' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  {{ templateData.type === 'WW' ? 'DOCX, DOT' : 'XML, WSV' }}
                </p>
              </div>
              <input type="file" class="hidden" @change="handleFileUpload" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: Permissions -->
    <div v-if="currentStep === 2">
      <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
        {{ language === 'de' ? 'Berechtigungen' : 'Permissions' }}
      </h4>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Benutzergruppen mit Zugriff' : 'User Groups with Access' }}
          </label>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="role in userRoles" :key="role.value" class="flex items-center">
              <input
                v-model="templateData.allowedRoles"
                type="checkbox"
                :value="role.value"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
              />
              <span class="text-sm text-gray-900 dark:text-white">{{ role.label }}</span>
            </label>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Korrespondenznotiz erstellen' : 'Create Correspondence Note' }}
          </label>
          <div class="flex items-center">
            <input
              v-model="templateData.createNote"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
            />
            <span class="text-sm text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Beim Drucken automatisch eine Korrespondenznotiz erstellen' : 'Automatically create a correspondence note when printing' }}
            </span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Verknüpfte Suchmakro' : 'Linked Search Macro' }}
          </label>
          <select
            v-model="templateData.searchMacroId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Keine' : 'None' }}</option>
            <option v-for="macro in searchMacros" :key="macro.id" :value="macro.id">{{ macro.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between">
      <button 
        v-if="currentStep > 0" 
        @click="currentStep--" 
        class="btn-secondary"
      >
        {{ language === 'de' ? 'Zurück' : 'Back' }}
      </button>
      <div v-else></div>
      
      <div>
        <button 
          v-if="currentStep < steps.length - 1" 
          @click="nextStep" 
          class="btn-primary"
          :disabled="!canProceed"
          :class="{ 'opacity-50 cursor-not-allowed': !canProceed }"
        >
          {{ language === 'de' ? 'Weiter' : 'Next' }}
        </button>
        <button 
          v-else 
          @click="finishWizard" 
          class="btn-primary"
        >
          {{ language === 'de' ? 'Fertigstellen' : 'Finish' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Upload } from 'lucide-vue-next'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  templates: {
    type: Array,
    default: () => []
  },
  searchMacros: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['finish', 'cancel'])

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Wizard steps
const steps = [
  { id: 'basic', name: language.value === 'de' ? 'Grundinformationen' : 'Basic Information' },
  { id: 'source', name: language.value === 'de' ? 'Quelle' : 'Source' },
  { id: 'permissions', name: language.value === 'de' ? 'Berechtigungen' : 'Permissions' }
]

const currentStep = ref(0)

// Template data
const templateData = ref({
  name: '',
  type: '',
  categoryId: '',
  recordType: '',
  allowedRoles: [] as string[],
  createNote: false,
  source: 'blank',
  existingTemplateId: '',
  searchMacroId: '',
  file: null as File | null
})

// User roles
const userRoles = computed(() => [
  { value: 'superadmin', label: language.value === 'de' ? 'Super-Administrator' : 'Super Administrator' },
  { value: 'schooladmin', label: language.value === 'de' ? 'Schuladministrator' : 'School Administrator' },
  { value: 'principal', label: language.value === 'de' ? 'Schulleiter' : 'Principal' },
  { value: 'teacher', label: language.value === 'de' ? 'Lehrer' : 'Teacher' },
  { value: 'admin', label: language.value === 'de' ? 'Administrator' : 'Administrator' }
])

// Computed properties
const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return templateData.value.name && templateData.value.type && templateData.value.categoryId && templateData.value.recordType
  }
  
  if (currentStep.value === 1) {
    if (templateData.value.source === 'existing') {
      return !!templateData.value.existingTemplateId
    }
    if (templateData.value.source === 'upload') {
      return !!templateData.value.file
    }
    return true
  }
  
  return true
})

// Methods
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    templateData.value.file = target.files[0]
  }
}

const finishWizard = () => {
  emit('finish', templateData.value)
}
</script>