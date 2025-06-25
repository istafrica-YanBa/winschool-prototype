<template>
  <div class="enrollment-form-config bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Settings class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Anmeldeformular konfigurieren' : 'Configure Application Form' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Konfigurieren Sie, welche Felder im Anmeldeformular angezeigt werden' : 'Configure which fields appear in the application form' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button 
          @click="showPreview = true" 
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <Eye class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Formular-Vorschau' : 'Preview Form' }}
        </button>
        <button 
          @click="saveConfiguration"
          class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <Save class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Konfiguration speichern' : 'Save Configuration' }}
        </button>
      </div>
    </div>

    <!-- Configuration Panel -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <!-- Field Configuration -->
      <div class="space-y-4 sm:space-y-6">
        <!-- Student Info Section -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6">
          <div class="flex items-center mb-3 sm:mb-4">
            <User class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 flex-shrink-0" />
            <h3 class="text-base sm:text-lg font-semibold text-slate-500 dark:text-slate-400">
              {{ language === 'de' ? 'Schülerinformationen' : 'Student Information' }}
            </h3>
          </div>
          <div class="space-y-2 sm:space-y-3">
            <div v-for="field in studentFields" :key="field.id" class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg space-y-3 sm:space-y-0">
              <div class="flex items-center min-w-0 flex-1">
                <span class="text-sm font-medium text-slate-800 dark:text-slate-50 truncate">{{ field.label }}</span>
                <span v-if="field.required" class="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full flex-shrink-0">
                  {{ language === 'de' ? 'Pflichtfeld' : 'Required' }}
                </span>
              </div>
              <div class="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
                <!-- Required Toggle -->
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ language === 'de' ? 'Pflicht' : 'Required' }}</span>
                  <button 
                    @click="toggleFieldRequired('student', field.id)"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 flex-shrink-0',
                      field.required ? 'bg-red-600' : 'bg-slate-200 dark:bg-slate-600'
                    ]"
                  >
                    <span :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      field.required ? 'translate-x-6' : 'translate-x-1'
                    ]" />
                  </button>
                </div>
                
                <!-- Enabled Toggle -->
                <div class="flex items-center space-x-2">
                  <span :class="field.enabled ? 'text-green-500' : 'text-slate-400'" class="text-xs font-medium whitespace-nowrap">
                    {{ field.enabled ? (language === 'de' ? 'Aktiviert' : 'Enabled') : (language === 'de' ? 'Deaktiviert' : 'Disabled') }}
                  </span>
                  <button 
                    @click="toggleField('student', field.id)"
                    :class="[
                      'relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex-shrink-0',
                      field.enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                    ]"
                  >
                    <span :class="[
                      'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                      field.enabled ? 'translate-x-6' : 'translate-x-1'
                    ]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Parent Info Section -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6">
          <div class="flex items-center mb-3 sm:mb-4">
            <Users class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 flex-shrink-0" />
            <h3 class="text-base sm:text-lg font-semibold text-slate-500 dark:text-slate-400">
              {{ language === 'de' ? 'Eltern-/Erziehungsberechtigteninformationen' : 'Parent/Guardian Information' }}
            </h3>
          </div>
          <div class="space-y-2 sm:space-y-3">
            <div v-for="field in parentFields" :key="field.id" class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg space-y-3 sm:space-y-0">
              <div class="flex items-center min-w-0 flex-1">
                <span class="text-sm font-medium text-slate-800 dark:text-slate-50 truncate">{{ field.label }}</span>
                <span v-if="field.required" class="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full flex-shrink-0">
                  {{ language === 'de' ? 'Pflichtfeld' : 'Required' }}
                </span>
              </div>
              <div class="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
                <!-- Required Toggle -->
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ language === 'de' ? 'Pflicht' : 'Required' }}</span>
                  <button 
                    @click="toggleFieldRequired('parent', field.id)"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 flex-shrink-0',
                      field.required ? 'bg-red-600' : 'bg-slate-200 dark:bg-slate-600'
                    ]"
                  >
                    <span :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      field.required ? 'translate-x-6' : 'translate-x-1'
                    ]" />
                  </button>
                </div>
                
                <!-- Enabled Toggle -->
                <div class="flex items-center space-x-2">
                  <span :class="field.enabled ? 'text-green-500' : 'text-slate-400'" class="text-xs font-medium whitespace-nowrap">
                    {{ field.enabled ? (language === 'de' ? 'Aktiviert' : 'Enabled') : (language === 'de' ? 'Deaktiviert' : 'Disabled') }}
                  </span>
                  <button 
                    @click="toggleField('parent', field.id)"
                    :class="[
                      'relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex-shrink-0',
                      field.enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                    ]"
                  >
                    <span :class="[
                      'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                      field.enabled ? 'translate-x-6' : 'translate-x-1'
                    ]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents Section -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6">
          <div class="flex items-center mb-3 sm:mb-4">
            <FileText class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 flex-shrink-0" />
            <h3 class="text-base sm:text-lg font-semibold text-slate-500 dark:text-slate-400">
              {{ language === 'de' ? 'Dokumente' : 'Documents' }}
            </h3>
          </div>
          <div class="space-y-2 sm:space-y-3">
            <div v-for="field in documentFields" :key="field.id" class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg space-y-3 sm:space-y-0">
              <div class="flex items-center min-w-0 flex-1">
                <span class="text-sm font-medium text-slate-800 dark:text-slate-50 truncate">{{ field.label }}</span>
                <span v-if="field.required" class="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full flex-shrink-0">
                  {{ language === 'de' ? 'Pflichtfeld' : 'Required' }}
                </span>
              </div>
              <div class="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
                <!-- Required Toggle -->
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ language === 'de' ? 'Pflicht' : 'Required' }}</span>
                  <button 
                    @click="toggleFieldRequired('document', field.id)"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 flex-shrink-0',
                      field.required ? 'bg-red-600' : 'bg-slate-200 dark:bg-slate-600'
                    ]"
                  >
                    <span :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      field.required ? 'translate-x-6' : 'translate-x-1'
                    ]" />
                  </button>
                </div>
                
                <!-- Enabled Toggle -->
                <div class="flex items-center space-x-2">
                  <span :class="field.enabled ? 'text-green-500' : 'text-slate-400'" class="text-xs font-medium whitespace-nowrap">
                    {{ field.enabled ? (language === 'de' ? 'Aktiviert' : 'Enabled') : (language === 'de' ? 'Deaktiviert' : 'Disabled') }}
                  </span>
                  <button 
                    @click="toggleField('document', field.id)"
                    :class="[
                      'relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex-shrink-0',
                      field.enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                    ]"
                  >
                    <span :class="[
                      'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                      field.enabled ? 'translate-x-6' : 'translate-x-1'
                    ]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration Summary -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-semibold text-slate-500 dark:text-slate-400 mb-3 sm:mb-4">
          {{ language === 'de' ? 'Konfigurationszusammenfassung' : 'Configuration Summary' }}
        </h3>
        
        <div class="space-y-3 sm:space-y-4">
          <div>
            <h4 class="text-sm font-medium text-slate-800 dark:text-slate-50 mb-2">
              {{ language === 'de' ? 'Aktivierte Felder' : 'Enabled Fields' }}
            </h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="field in enabledFields" 
                :key="field.id"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                {{ field.label }}
              </span>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium text-slate-800 dark:text-slate-50 mb-2">
              {{ language === 'de' ? 'Deaktivierte Felder' : 'Disabled Fields' }}
            </h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="field in disabledFields" 
                :key="field.id"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
              >
                {{ field.label }}
              </span>
            </div>
          </div>

          <!-- Statistics -->
          <div class="border-t border-slate-200 dark:border-slate-600 pt-3 sm:pt-4">
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <p class="text-xl sm:text-2xl font-bold text-green-500">{{ enabledFields.length }}</p>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Aktiviert' : 'Enabled' }}</p>
              </div>
              <div>
                <p class="text-xl sm:text-2xl font-bold text-slate-400">{{ disabledFields.length }}</p>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Deaktiviert' : 'Disabled' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Preview Modal with Pagination -->
    <div v-if="showPreview" class="fixed inset-0 bg-slate-600 bg-opacity-50 dark:bg-slate-900 dark:bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <div class="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-600">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <h3 class="text-base sm:text-lg font-semibold text-slate-500 dark:text-slate-400">
              {{ language === 'de' ? 'Anmeldeformular-Vorschau' : 'Application Form Preview' }}
            </h3>
            <button @click="showPreview = false" class="self-end sm:self-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <!-- Pagination Navigation -->
          <div class="flex justify-center mt-3 sm:mt-4">
            <div class="flex space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
              <button
                v-for="(step, index) in previewSteps"
                :key="index"
                @click="currentPreviewStep = index"
                :class="[
                  'px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0',
                  currentPreviewStep === index
                    ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-50 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                ]"
              >
                {{ step.title }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
          <!-- Step 1: Student Information -->
          <div v-if="currentPreviewStep === 0 && enabledStudentFields.length > 0">
            <h4 class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 mb-3 sm:mb-4">
              {{ language === 'de' ? 'Schülerinformationen' : 'Student Information' }}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div v-for="field in enabledStudentFields" :key="field.id" class="col-span-1">
                <label class="block text-sm font-medium text-slate-800 dark:text-slate-50 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <input
                  :type="field.type || 'text'"
                  :placeholder="field.placeholder"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Step 2: Parent Information -->
          <div v-if="currentPreviewStep === 1 && enabledParentFields.length > 0">
            <h4 class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 mb-3 sm:mb-4">
              {{ language === 'de' ? 'Eltern-/Erziehungsberechtigteninformationen' : 'Parent/Guardian Information' }}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div v-for="field in enabledParentFields" :key="field.id" class="col-span-1">
                <label class="block text-sm font-medium text-slate-800 dark:text-slate-50 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <input
                  :type="field.type || 'text'"
                  :placeholder="field.placeholder"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Step 3: Document Uploads -->
          <div v-if="currentPreviewStep === 2 && enabledDocumentFields.length > 0">
            <h4 class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 mb-3 sm:mb-4">
              {{ language === 'de' ? 'Dokumente hochladen' : 'Document Uploads' }}
            </h4>
            <div class="space-y-3">
              <div v-for="field in enabledDocumentFields" :key="field.id" class="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                <div class="text-center">
                  <Upload class="h-6 w-6 sm:h-8 sm:w-8 text-slate-400 mx-auto mb-2" />
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-50">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500">*</span>
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ field.description || 'Click to upload or drag and drop' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- No fields message -->
          <div v-if="!hasEnabledFieldsForCurrentStep" class="text-center py-8">
            <p class="text-slate-500 dark:text-slate-400">
              {{ language === 'de' ? 'Keine Felder für diesen Schritt aktiviert' : 'No fields enabled for this step' }}
            </p>
          </div>
        </div>

        <div class="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-600">
          <div class="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
            <button 
              @click="previousPreviewStep"
              :disabled="currentPreviewStep === 0"
              class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium px-4 py-3 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              {{ language === 'de' ? 'Zurück' : 'Previous' }}
            </button>
            
            <button @click="showPreview = false" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg transition-colors text-sm sm:text-base">
              {{ language === 'de' ? 'Vorschau schließen' : 'Close Preview' }}
            </button>
            
            <button 
              @click="nextPreviewStep"
              :disabled="currentPreviewStep === previewSteps.length - 1"
              class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium px-4 py-3 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              {{ language === 'de' ? 'Weiter' : 'Next' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '../stores/theme'
import { User, Users, FileText, Eye, Save, X, Upload, Settings } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showPreview = ref(false)
const currentPreviewStep = ref(0)

// Preview steps
const previewSteps = computed(() => [
  { title: language.value === 'de' ? 'Schülerinformationen' : 'Student Information' },
  { title: language.value === 'de' ? 'Eltern-/Erziehungsberechtigte' : 'Parent/Guardian' },
  { title: language.value === 'de' ? 'Dokumente' : 'Documents' }
])

// Field definitions
const studentFields = ref([
  { 
    id: 'firstName', 
    label: language.value === 'de' ? 'Vorname' : 'First Name', 
    enabled: true, 
    required: true, 
    type: 'text',
    placeholder: language.value === 'de' ? 'Vorname eingeben' : 'Enter first name'
  },
  { 
    id: 'lastName', 
    label: language.value === 'de' ? 'Nachname' : 'Last Name', 
    enabled: true, 
    required: true, 
    type: 'text',
    placeholder: language.value === 'de' ? 'Nachname eingeben' : 'Enter last name'
  },
  { 
    id: 'dateOfBirth', 
    label: language.value === 'de' ? 'Geburtsdatum' : 'Date of Birth', 
    enabled: true, 
    required: true, 
    type: 'date'
  },
  { 
    id: 'gender', 
    label: language.value === 'de' ? 'Geschlecht' : 'Gender', 
    enabled: true, 
    required: false, 
    type: 'select'
  },
  { 
    id: 'previousSchool', 
    label: language.value === 'de' ? 'Vorherige Schule' : 'Previous School', 
    enabled: false, 
    required: false, 
    type: 'text',
    placeholder: language.value === 'de' ? 'Name der vorherigen Schule' : 'Previous school name'
  },
  { 
    id: 'address', 
    label: language.value === 'de' ? 'Adresse' : 'Address', 
    enabled: true, 
    required: false, 
    type: 'text',
    placeholder: language.value === 'de' ? 'Vollständige Adresse' : 'Full address'
  },
  { 
    id: 'email', 
    label: language.value === 'de' ? 'E-Mail' : 'Email', 
    enabled: false, 
    required: false, 
    type: 'email',
    placeholder: language.value === 'de' ? 'E-Mail-Adresse' : 'Email address'
  },
  { 
    id: 'phone', 
    label: language.value === 'de' ? 'Telefon' : 'Phone', 
    enabled: false, 
    required: false, 
    type: 'tel',
    placeholder: language.value === 'de' ? 'Telefonnummer' : 'Phone number'
  },
  { 
    id: 'nationality', 
    label: language.value === 'de' ? 'Staatsangehörigkeit' : 'Nationality', 
    enabled: true, 
    required: false, 
    type: 'text',
    placeholder: language.value === 'de' ? 'Staatsangehörigkeit' : 'Nationality'
  },
  { 
    id: 'languageSpoken', 
    label: language.value === 'de' ? 'Sprache zu Hause' : 'Language Spoken at Home', 
    enabled: false, 
    required: false, 
    type: 'text',
    placeholder: language.value === 'de' ? 'Hauptsprache zu Hause' : 'Primary language at home'
  },
  { 
    id: 'religion', 
    label: language.value === 'de' ? 'Religion' : 'Religion', 
    enabled: false, 
    required: false, 
    type: 'text',
    placeholder: language.value === 'de' ? 'Religionszugehörigkeit' : 'Religious affiliation'
  },
  { 
    id: 'disabilityStatus', 
    label: language.value === 'de' ? 'Behinderungsstatus' : 'Disability Status', 
    enabled: false, 
    required: false, 
    type: 'text',
    placeholder: language.value === 'de' ? 'Behinderung oder besondere Bedürfnisse' : 'Disability or special needs'
  },
  { 
    id: 'medicalNotes', 
    label: language.value === 'de' ? 'Medizinische Hinweise' : 'Medical Notes', 
    enabled: false, 
    required: false, 
    type: 'textarea',
    placeholder: language.value === 'de' ? 'Wichtige medizinische Informationen' : 'Important medical information'
  },
  { 
    id: 'specialEducationalNeeds', 
    label: language.value === 'de' ? 'Besondere Bildungsbedürfnisse' : 'Special Educational Needs', 
    enabled: false, 
    required: false, 
    type: 'textarea',
    placeholder: language.value === 'de' ? 'Besondere Bildungsanforderungen' : 'Special educational requirements'
  }
])

const parentFields = ref([
  { 
    id: 'parentFirstName', 
    label: language.value === 'de' ? 'Vorname (Eltern)' : 'Parent First Name', 
    enabled: true, 
    required: true, 
    type: 'text',
    placeholder: language.value === 'de' ? 'Vorname des Elternteils' : 'Parent first name'
  },
  { 
    id: 'parentLastName', 
    label: language.value === 'de' ? 'Nachname (Eltern)' : 'Parent Last Name', 
    enabled: true, 
    required: true, 
    type: 'text',
    placeholder: language.value === 'de' ? 'Nachname des Elternteils' : 'Parent last name'
  },
  { 
    id: 'relationship', 
    label: language.value === 'de' ? 'Beziehung zum Schüler' : 'Relationship to Student', 
    enabled: true, 
    required: true, 
    type: 'select'
  },
  { 
    id: 'parentEmail', 
    label: language.value === 'de' ? 'E-Mail (Eltern)' : 'Parent Email', 
    enabled: true, 
    required: true, 
    type: 'email',
    placeholder: language.value === 'de' ? 'E-Mail-Adresse der Eltern' : 'Parent email address'
  },
  { 
    id: 'parentPhone', 
    label: language.value === 'de' ? 'Telefon (Eltern)' : 'Parent Phone', 
    enabled: true, 
    required: true, 
    type: 'tel',
    placeholder: language.value === 'de' ? 'Telefonnummer der Eltern' : 'Parent phone number'
  },
  { 
    id: 'parentAddress', 
    label: language.value === 'de' ? 'Adresse (Eltern)' : 'Parent Address', 
    enabled: false, 
    required: false, 
    type: 'text',
    placeholder: language.value === 'de' ? 'Adresse der Eltern (falls abweichend)' : 'Parent address (if different)'
  }
])

const documentFields = ref([
  { 
    id: 'studentPhoto', 
    label: language.value === 'de' ? 'Schülerfoto' : 'Student Photo', 
    enabled: true, 
    required: false,
    description: language.value === 'de' ? 'Aktuelles Passfoto des Schülers' : 'Recent passport photo of student'
  },
  { 
    id: 'transcript', 
    label: language.value === 'de' ? 'Zeugnis/Akademische Aufzeichnungen' : 'Transcript/Academic Records', 
    enabled: true, 
    required: true,
    description: language.value === 'de' ? 'Letztes Zeugnis oder akademische Aufzeichnungen' : 'Latest transcript or academic records'
  },
  { 
    id: 'birthCertificate', 
    label: language.value === 'de' ? 'Geburtsurkunde oder Ausweis' : 'Birth Certificate or ID', 
    enabled: true, 
    required: true,
    description: language.value === 'de' ? 'Geburtsurkunde oder gültiger Ausweis' : 'Birth certificate or valid ID document'
  },
  { 
    id: 'additionalDocuments', 
    label: language.value === 'de' ? 'Weitere Dokumente' : 'Additional Documents', 
    enabled: false, 
    required: false,
    description: language.value === 'de' ? 'Weitere relevante Dokumente' : 'Any other relevant documents'
  }
])

// Computed properties for enabled/disabled fields
const enabledFields = computed(() => {
  return [
    ...studentFields.value.filter(f => f.enabled),
    ...parentFields.value.filter(f => f.enabled),
    ...documentFields.value.filter(f => f.enabled)
  ]
})

const disabledFields = computed(() => {
  return [
    ...studentFields.value.filter(f => !f.enabled),
    ...parentFields.value.filter(f => !f.enabled),
    ...documentFields.value.filter(f => !f.enabled)
  ]
})

const enabledStudentFields = computed(() => studentFields.value.filter(f => f.enabled))
const enabledParentFields = computed(() => parentFields.value.filter(f => f.enabled))
const enabledDocumentFields = computed(() => documentFields.value.filter(f => f.enabled))

const hasEnabledFieldsForCurrentStep = computed(() => {
  switch (currentPreviewStep.value) {
    case 0:
      return enabledStudentFields.value.length > 0
    case 1:
      return enabledParentFields.value.length > 0
    case 2:
      return enabledDocumentFields.value.length > 0
    default:
      return false
  }
})

// Methods
const toggleField = (category: string, fieldId: string) => {
  let fields
  switch (category) {
    case 'student':
      fields = studentFields.value
      break
    case 'parent':
      fields = parentFields.value
      break
    case 'document':
      fields = documentFields.value
      break
    default:
      return
  }
  
  const field = fields.find(f => f.id === fieldId)
  if (field) {
    field.enabled = !field.enabled
  }
}

const toggleFieldRequired = (category: string, fieldId: string) => {
  let fields
  switch (category) {
    case 'student':
      fields = studentFields.value
      break
    case 'parent':
      fields = parentFields.value
      break
    case 'document':
      fields = documentFields.value
      break
    default:
      return
  }
  
  const field = fields.find(f => f.id === fieldId)
  if (field) {
    field.required = !field.required
  }
}

const nextPreviewStep = () => {
  if (currentPreviewStep.value < previewSteps.value.length - 1) {
    currentPreviewStep.value++
  }
}

const previousPreviewStep = () => {
  if (currentPreviewStep.value > 0) {
    currentPreviewStep.value--
  }
}

const saveConfiguration = () => {
  const configuration = {
    studentFields: studentFields.value,
    parentFields: parentFields.value,
    documentFields: documentFields.value,
    timestamp: new Date().toISOString()
  }
  
  console.log('Saving configuration:', configuration)
  
  // Mock API call
  setTimeout(() => {
    alert(language.value === 'de' 
      ? 'Konfiguration erfolgreich gespeichert!' 
      : 'Configuration saved successfully!'
    )
  }, 1000)
}

// Watch for language changes to update field labels
watch(language, (newLang) => {
  // Update field labels when language changes
  // This would typically be handled by a more sophisticated i18n system
})
</script> 
