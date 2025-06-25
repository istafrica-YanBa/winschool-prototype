<template>
  <div class="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Database class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Platzhalter-Manager' : 'Placeholder Manager' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie Platzhalter für Berichte. Vorschau und Tooltips werden beim Bearbeiten angezeigt.' : 'Manage placeholders for reports. Preview and tooltips are shown while editing.' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="addNewPlaceholder" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Neuer Platzhalter' : 'New Placeholder' }}
        </button>
        <button @click="saveAllPlaceholders" class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Save class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Speichern' : 'Save All' }}
        </button>
      </div>
    </div>

    <!-- Quick Insert and Preview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Quick Insert Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-slate-500 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Schnelleinfügung' : 'Quick Insert' }}
        </h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Kategorie' : 'Category' }}
            </label>
            <select v-model="selectedCategory" @change="filterPlaceholders" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
              <option value="">{{ language === 'de' ? 'Alle Kategorien' : 'All Categories' }}</option>
              <option value="student">{{ language === 'de' ? 'Schülerdaten' : 'Student Data' }}</option>
              <option value="school">{{ language === 'de' ? 'Schuldaten' : 'School Data' }}</option>
              <option value="academic">{{ language === 'de' ? 'Akademische Daten' : 'Academic Data' }}</option>
              <option value="custom">{{ language === 'de' ? 'Benutzerdefiniert' : 'Custom' }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            <button
              v-for="placeholder in filteredPlaceholders"
              :key="placeholder.id"
              @click="copyToClipboard(placeholder.syntax)"
              class="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors group"
              :title="placeholder.description"
            >
              <div class="text-sm font-medium text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                {{ placeholder.syntax }}
              </div>
              <div class="text-xs text-slate-600 dark:text-gray-400 mt-1" style="font-family: Inter, sans-serif;">
                {{ placeholder.description }}
              </div>
              <div class="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Klicken zum Kopieren' : 'Click to copy' }}
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Live Preview Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-slate-500 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Live-Vorschau' : 'Live Preview' }}
        </h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Text mit Platzhaltern' : 'Text with Placeholders' }}
            </label>
            <textarea
              v-model="previewText"
              @input="updatePreview"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white font-mono text-sm"
              style="font-family: 'Courier New', monospace;"
              :placeholder="language === 'de' ? 'Geben Sie Text mit Platzhaltern ein, z.B. {{StudentFirstName}}' : 'Enter text with placeholders, e.g. {{StudentFirstName}}'"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Vorschau-Ergebnis' : 'Preview Result' }}
            </label>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 min-h-[100px] border border-gray-200 dark:border-gray-600">
              <div class="text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;" v-html="renderedPreview"></div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Beispielstudent' : 'Sample Student' }}
            </label>
            <select v-model="selectedSampleStudent" @change="updatePreview" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
              <option v-for="student in sampleStudents" :key="student.id" :value="student.id">
                {{ student.firstName }} {{ student.lastName }} ({{ student.gender }})
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder Management -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-slate-500 dark:text-white" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Platzhalter verwalten' : 'Manage Placeholders' }}
        </h2>
        <div class="flex space-x-3">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="language === 'de' ? 'Platzhalter suchen...' : 'Search placeholders...'"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white"
            style="font-family: Inter, sans-serif;"
          />
          <button @click="exportPlaceholders" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Exportieren' : 'Export' }}
          </button>
        </div>
      </div>

      <!-- Placeholders Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-600">
              <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Syntax' : 'Syntax' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Kategorie' : 'Category' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Typ' : 'Type' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="placeholder in searchedPlaceholders"
              :key="placeholder.id"
              class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="py-3 px-4">
                <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-slate-800 dark:text-white">
                  {{ placeholder.syntax }}
                </code>
              </td>
              <td class="py-3 px-4 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                {{ placeholder.description }}
              </td>
              <td class="py-3 px-4">
                <span :class="getCategoryColor(placeholder.category)" class="px-2 py-1 text-xs font-medium rounded-full" style="font-family: Inter, sans-serif;">
                  {{ getCategoryLabel(placeholder.category) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span :class="getTypeColor(placeholder.type)" class="px-2 py-1 text-xs font-medium rounded-full" style="font-family: Inter, sans-serif;">
                  {{ getTypeLabel(placeholder.type) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="editPlaceholder(placeholder)" class="text-blue-600 hover:text-blue-800 transition-colors">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="copyToClipboard(placeholder.syntax)" class="text-green-600 hover:text-green-800 transition-colors">
                    <Copy class="h-4 w-4" />
                  </button>
                  <button @click="deletePlaceholder(placeholder.id)" class="text-red-600 hover:text-red-800 transition-colors">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Gender-Specific and Fallback Configuration -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
        {{ language === 'de' ? 'Geschlechtsspezifische Ersetzungen' : 'Gender-Specific Substitutions' }}
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="font-medium text-slate-800 dark:text-white mb-3" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Anrede-Platzhalter' : 'Salutation Placeholders' }}
          </h3>
          <div class="space-y-3">
            <div v-for="salutation in genderSpecificPlaceholders" :key="salutation.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div class="flex justify-between items-start mb-2">
                <code class="text-sm font-mono text-slate-800 dark:text-white">{{ salutation.syntax }}</code>
                <button @click="editGenderPlaceholder(salutation)" class="text-blue-600 hover:text-blue-800">
                  <Edit class="h-4 w-4" />
                </button>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="text-slate-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                  <strong>{{ language === 'de' ? 'Männlich:' : 'Male:' }}</strong> {{ salutation.male }}
                </div>
                <div class="text-slate-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                  <strong>{{ language === 'de' ? 'Weiblich:' : 'Female:' }}</strong> {{ salutation.female }}
                </div>
                <div class="text-slate-600 dark:text-gray-400 col-span-2" style="font-family: Inter, sans-serif;">
                  <strong>{{ language === 'de' ? 'Fallback:' : 'Fallback:' }}</strong> {{ salutation.fallback }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-medium text-slate-800 dark:text-white mb-3" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Standard-Fallbacks' : 'Default Fallbacks' }}
          </h3>
          <div class="space-y-3">
            <div v-for="fallback in defaultFallbacks" :key="fallback.field" class="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div>
                <div class="text-sm font-medium text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  {{ fallback.field }}
                </div>
                <div class="text-xs text-slate-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                  {{ language === 'de' ? 'Fallback:' : 'Fallback:' }} "{{ fallback.value }}"
                </div>
              </div>
              <button @click="editFallback(fallback)" class="text-blue-600 hover:text-blue-800">
                <Edit class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Placeholder Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
          {{ editingPlaceholder?.id ? (language === 'de' ? 'Platzhalter bearbeiten' : 'Edit Placeholder') : (language === 'de' ? 'Neuer Platzhalter' : 'New Placeholder') }}
        </h3>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Syntax' : 'Syntax' }}
              </label>
              <input v-model="placeholderForm.syntax" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white font-mono" placeholder="{{PlaceholderName}}" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Kategorie' : 'Category' }}
              </label>
              <select v-model="placeholderForm.category" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                <option value="student">{{ language === 'de' ? 'Schülerdaten' : 'Student Data' }}</option>
                <option value="school">{{ language === 'de' ? 'Schuldaten' : 'School Data' }}</option>
                <option value="academic">{{ language === 'de' ? 'Akademische Daten' : 'Academic Data' }}</option>
                <option value="custom">{{ language === 'de' ? 'Benutzerdefiniert' : 'Custom' }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Beschreibung' : 'Description' }}
            </label>
            <input v-model="placeholderForm.description" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Typ' : 'Type' }}
              </label>
              <select v-model="placeholderForm.type" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                <option value="text">{{ language === 'de' ? 'Text' : 'Text' }}</option>
                <option value="number">{{ language === 'de' ? 'Zahl' : 'Number' }}</option>
                <option value="date">{{ language === 'de' ? 'Datum' : 'Date' }}</option>
                <option value="conditional">{{ language === 'de' ? 'Bedingt' : 'Conditional' }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Standard-Wert' : 'Default Value' }}
              </label>
              <input v-model="placeholderForm.defaultValue" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;" />
            </div>
          </div>

          <div v-if="placeholderForm.type === 'conditional'">
            <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Bedingungslogik' : 'Conditional Logic' }}
            </label>
            <textarea v-model="placeholderForm.conditionalLogic" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white font-mono" style="font-family: 'Courier New', monospace;" placeholder="IF condition THEN value ELSE fallback"></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="showEditModal = false" class="px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
          </button>
          <button @click="savePlaceholder" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Speichern' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Plus, Save, Edit, Copy, Trash2, Database } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const selectedCategory = ref('')
const searchQuery = ref('')
const previewText = ref('Dear {{Salutation}}, \n\n{{StudentFirstName}} {{StudentLastName}} has achieved a grade of {{AverageGrade}} this semester.')
const renderedPreview = ref('')
const selectedSampleStudent = ref(1)
const showEditModal = ref(false)
const editingPlaceholder = ref(null)

// Sample students for preview
const sampleStudents = ref([
  { id: 1, firstName: 'Max', lastName: 'Mustermann', gender: 'male', averageGrade: '2.1' },
  { id: 2, firstName: 'Emma', lastName: 'Schmidt', gender: 'female', averageGrade: '1.8' },
  { id: 3, firstName: 'Alex', lastName: 'Johnson', gender: 'other', averageGrade: '2.5' }
])

// Placeholder form
const placeholderForm = ref({
  syntax: '',
  description: '',
  category: 'student',
  type: 'text',
  defaultValue: '',
  conditionalLogic: ''
})

// Main placeholders data
const placeholders = ref([
  {
    id: 1,
    syntax: '{{StudentFirstName}}',
    description: language.value === 'de' ? 'Vorname des Schülers' : 'Student first name',
    category: 'student',
    type: 'text',
    defaultValue: 'N/A'
  },
  {
    id: 2,
    syntax: '{{StudentLastName}}',
    description: language.value === 'de' ? 'Nachname des Schülers' : 'Student last name',
    category: 'student',
    type: 'text',
    defaultValue: 'N/A'
  },
  {
    id: 3,
    syntax: '{{StudentFullName}}',
    description: language.value === 'de' ? 'Vollständiger Name des Schülers' : 'Student full name',
    category: 'student',
    type: 'text',
    defaultValue: 'N/A'
  },
  {
    id: 4,
    syntax: '{{AverageGrade}}',
    description: language.value === 'de' ? 'Durchschnittsnote' : 'Average grade',
    category: 'academic',
    type: 'number',
    defaultValue: '0.0'
  },
  {
    id: 5,
    syntax: '{{CurrentDate}}',
    description: language.value === 'de' ? 'Aktuelles Datum' : 'Current date',
    category: 'school',
    type: 'date',
    defaultValue: new Date().toLocaleDateString()
  },
  {
    id: 6,
    syntax: '{{SchoolName}}',
    description: language.value === 'de' ? 'Name der Schule' : 'School name',
    category: 'school',
    type: 'text',
    defaultValue: 'WinSchool Academy'
  },
  {
    id: 7,
    syntax: '{{ClassTeacher}}',
    description: language.value === 'de' ? 'Klassenlehrer' : 'Class teacher',
    category: 'school',
    type: 'text',
    defaultValue: 'N/A'
  },
  {
    id: 8,
    syntax: '{{PromotionStatus}}',
    description: language.value === 'de' ? 'Versetzungsstatus' : 'Promotion status',
    category: 'academic',
    type: 'conditional',
    defaultValue: 'To be determined'
  }
])

// Gender-specific placeholders
const genderSpecificPlaceholders = ref([
  {
    id: 1,
    syntax: '{{Salutation}}',
    male: language.value === 'de' ? 'Lieber' : 'Dear Mr.',
    female: language.value === 'de' ? 'Liebe' : 'Dear Ms.',
    fallback: language.value === 'de' ? 'Liebe/r' : 'Dear'
  },
  {
    id: 2,
    syntax: '{{StudentPronoun}}',
    male: language.value === 'de' ? 'er' : 'he',
    female: language.value === 'de' ? 'sie' : 'she',
    fallback: language.value === 'de' ? 'er/sie' : 'they'
  }
])

// Default fallbacks
const defaultFallbacks = ref([
  { field: 'StudentFirstName', value: 'Student' },
  { field: 'StudentLastName', value: 'Name' },
  { field: 'AverageGrade', value: '0.0' },
  { field: 'ClassTeacher', value: 'Not Assigned' }
])

// Computed properties
const filteredPlaceholders = computed(() => {
  if (!selectedCategory.value) return placeholders.value
  return placeholders.value.filter(p => p.category === selectedCategory.value)
})

const searchedPlaceholders = computed(() => {
  if (!searchQuery.value) return placeholders.value
  const query = searchQuery.value.toLowerCase()
  return placeholders.value.filter(p =>
    p.syntax.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  )
})

// Methods
const filterPlaceholders = () => {
  // Triggered when category changes
}

const updatePreview = () => {
  const student = sampleStudents.value.find(s => s.id === selectedSampleStudent.value)
  if (!student) return

  let preview = previewText.value

  // Replace student-specific placeholders
  preview = preview.replace(/\{\{StudentFirstName\}\}/g, student.firstName)
  preview = preview.replace(/\{\{StudentLastName\}\}/g, student.lastName)
  preview = preview.replace(/\{\{StudentFullName\}\}/g, `${student.firstName} ${student.lastName}`)
  preview = preview.replace(/\{\{AverageGrade\}\}/g, student.averageGrade)

  // Replace gender-specific placeholders
  const salutation = genderSpecificPlaceholders.value.find(p => p.syntax === '{{Salutation}}')
  if (salutation) {
    let salutationText = salutation.fallback
    if (student.gender === 'male') salutationText = salutation.male
    else if (student.gender === 'female') salutationText = salutation.female
    preview = preview.replace(/\{\{Salutation\}\}/g, salutationText)
  }

  // Replace other placeholders
  preview = preview.replace(/\{\{CurrentDate\}\}/g, new Date().toLocaleDateString())
  preview = preview.replace(/\{\{SchoolName\}\}/g, 'WinSchool Academy')
  preview = preview.replace(/\{\{ClassTeacher\}\}/g, 'Dr. Weber')
  preview = preview.replace(/\{\{PromotionStatus\}\}/g, language.value === 'de' ? 'Versetzt' : 'Promoted')

  renderedPreview.value = preview.replace(/\n/g, '<br>')
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // Show success notification
    const notification = document.createElement('div')
    notification.textContent = language.value === 'de' ? 'In Zwischenablage kopiert!' : 'Copied to clipboard!'
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const addNewPlaceholder = () => {
  editingPlaceholder.value = null
  placeholderForm.value = {
    syntax: '',
    description: '',
    category: 'student',
    type: 'text',
    defaultValue: '',
    conditionalLogic: ''
  }
  showEditModal.value = true
}

const editPlaceholder = (placeholder) => {
  editingPlaceholder.value = placeholder
  placeholderForm.value = { ...placeholder }
  showEditModal.value = true
}

const savePlaceholder = () => {
  if (!placeholderForm.value.syntax || !placeholderForm.value.description) return

  if (editingPlaceholder.value) {
    // Update existing
    const index = placeholders.value.findIndex(p => p.id === editingPlaceholder.value.id)
    if (index !== -1) {
      placeholders.value[index] = { ...placeholderForm.value, id: editingPlaceholder.value.id }
    }
  } else {
    // Add new
    const newPlaceholder = {
      ...placeholderForm.value,
      id: Date.now()
    }
    placeholders.value.push(newPlaceholder)
  }

  showEditModal.value = false
}

const deletePlaceholder = (id) => {
  if (confirm(language.value === 'de' ? 'Platzhalter wirklich löschen?' : 'Really delete placeholder?')) {
    const index = placeholders.value.findIndex(p => p.id === id)
    if (index !== -1) {
      placeholders.value.splice(index, 1)
    }
  }
}

const saveAllPlaceholders = () => {
  // Simulate saving
  alert(language.value === 'de' ? 'Alle Platzhalter gespeichert!' : 'All placeholders saved!')
}

const exportPlaceholders = () => {
  const data = JSON.stringify(placeholders.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'placeholders.json'
  link.click()
  URL.revokeObjectURL(url)
}

const editGenderPlaceholder = (placeholder) => {
  // Implementation for editing gender-specific placeholders
  console.log('Edit gender placeholder:', placeholder)
}

const editFallback = (fallback) => {
  // Implementation for editing fallback values
  console.log('Edit fallback:', fallback)
}

// Utility functions
const getCategoryColor = (category) => {
  const colors = {
    student: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    school: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    academic: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
    custom: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'
  }
  return colors[category] || colors.custom
}

const getCategoryLabel = (category) => {
  const labels = {
    student: language.value === 'de' ? 'Schüler' : 'Student',
    school: language.value === 'de' ? 'Schule' : 'School',
    academic: language.value === 'de' ? 'Akademisch' : 'Academic',
    custom: language.value === 'de' ? 'Benutzerdefiniert' : 'Custom'
  }
  return labels[category] || category
}

const getTypeColor = (type) => {
  const colors = {
    text: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200',
    number: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    date: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    conditional: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
  }
  return colors[type] || colors.text
}

const getTypeLabel = (type) => {
  const labels = {
    text: language.value === 'de' ? 'Text' : 'Text',
    number: language.value === 'de' ? 'Zahl' : 'Number',
    date: language.value === 'de' ? 'Datum' : 'Date',
    conditional: language.value === 'de' ? 'Bedingt' : 'Conditional'
  }
  return labels[type] || type
}

// Initialize
onMounted(() => {
  updatePreview()
})
</script> 
