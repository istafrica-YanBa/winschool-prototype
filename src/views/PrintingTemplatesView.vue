<template>
  <div class="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <FileText class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Druckvorlagen' : 'Print Templates' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie Druckvorlagen für Briefe, Zeugnisse und Listen' : 'Manage print templates for letters, certificates, and lists' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <router-link
          to="/dashboard/support"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <LifeBuoy class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Support' : 'Support' }}
        </router-link>
        <button @click="showImportModal = true" class="w-full sm:w-auto bg-slate-600 hover:bg-slate-700 text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Upload class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Importieren' : 'Import' }}
        </button>
        <button @click="showTemplateModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Neue Vorlage' : 'New Template' }}
        </button>
      </div>
    </div>

    <!-- Template Categories and List -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Categories -->
      <div class="lg:col-span-1 space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">
          {{ language === 'de' ? 'Kategorien' : 'Categories' }}
        </h2>
        
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="language === 'de' ? 'Vorlagen suchen...' : 'Search templates...'"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"
          />
        </div>
        
        <div class="space-y-2">
          <div 
            class="p-3 rounded-lg cursor-pointer transition-colors"
            :class="selectedCategory === null 
              ? 'bg-primary-100 dark:bg-primary-900/30 border-l-4 border-primary-600' 
              : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600'"
            @click="selectedCategory = null"
          >
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-900 dark:text-slate-50">{{ language === 'de' ? 'Alle Vorlagen' : 'All Templates' }}</h3>
              <span class="text-sm text-gray-500 dark:text-slate-400">{{ allTemplatesCount }}</span>
            </div>
          </div>
          
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="p-3 rounded-lg cursor-pointer transition-colors"
            :class="selectedCategory?.id === category.id 
              ? 'bg-primary-100 dark:bg-primary-900/30 border-l-4 border-primary-600' 
              : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600'"
            @click="selectedCategory = category"
          >
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-900 dark:text-slate-50">{{ category.name }}</h3>
              <span class="text-sm text-gray-500 dark:text-slate-400">{{ category.templates.length }}</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-slate-400 mt-1">{{ category.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Templates List -->
      <div class="lg:col-span-3 space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">
            {{ selectedCategory ? selectedCategory.name : (language === 'de' ? 'Alle Vorlagen' : 'All Templates') }}
          </h2>
          <div class="flex space-x-2">
            <select 
              v-model="templateTypeFilter"
              class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"
            >
              <option value="">{{ language === 'de' ? 'Alle Typen' : 'All Types' }}</option>
              <option value="WW">{{ language === 'de' ? 'Word-Vorlagen (WW)' : 'Word Templates (WW)' }}</option>
              <option value="WS">{{ language === 'de' ? 'Listengenerator (WS)' : 'List Generator (WS)' }}</option>
            </select>
            <button @click="showExportModal = true" class="btn-secondary text-sm">
              {{ language === 'de' ? 'Exportieren' : 'Export' }}
            </button>
          </div>
        </div>
        
        <div v-if="filteredTemplates.length === 0" class="bg-gray-50 dark:bg-slate-700 rounded-lg p-8 text-center">
          <SearchX class="h-12 w-12 text-gray-400 dark:text-slate-400 mx-auto mb-3" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-slate-50">
            {{ language === 'de' ? 'Keine Vorlagen gefunden' : 'No templates found' }}
          </h3>
          <p class="text-gray-600 dark:text-slate-400 mt-2">
            {{ language === 'de' 
              ? 'Versuchen Sie es mit anderen Suchkriterien oder erstellen Sie eine neue Vorlage.' 
              : 'Try different search criteria or create a new template.' }}
          </p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="template in filteredTemplates" 
            :key="template.id"
            class="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            @click="viewTemplate(template)"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-start">
                <component :is="getTemplateTypeIcon(template.type)" class="h-5 w-5 text-gray-400 dark:text-slate-400 mt-1 mr-3" />
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-slate-50">{{ template.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-slate-400 mt-1">{{ getRecordTypeDisplay(template.recordType) }}</p>
                  <div class="flex items-center mt-2">
                    <span :class="getTemplateTypeColor(template.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ template.type }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-slate-400 ml-2">{{ template.lastModified }}</span>
                  </div>
                </div>
              </div>
              <div class="flex space-x-1">
                <button @click.stop="editTemplate(template)" class="p-1 text-primary-600 hover:text-primary-800 rounded">
                  <Edit class="h-4 w-4" />
                </button>
                <button @click.stop="copyTemplate(template)" class="p-1 text-secondary-600 hover:text-secondary-800 rounded">
                  <Copy class="h-4 w-4" />
                </button>
                <button @click.stop="printTemplate(template)" class="p-1 text-blue-600 hover:text-blue-800 rounded">
                  <Printer class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Access Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Individual Correspondence -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4 flex items-center">
          <FileText class="h-5 w-5 mr-2 text-primary-600" />
          {{ language === 'de' ? 'Individuelle Korrespondenz' : 'Individual Correspondence' }}
        </h2>
        <p class="text-gray-600 dark:text-slate-400 mb-4">
          {{ language === 'de' 
            ? 'Erstellen Sie einmalige Briefe mit vorausgefüllten Daten und Variablen.' 
            : 'Create one-off letters with prefilled data and variables.' }}
        </p>
        <button @click="showCorrespondenceModal = true" class="w-full btn-primary">
          {{ language === 'de' ? 'Brief erstellen' : 'Create Letter' }}
        </button>
      </div>
      
      <!-- List Generator -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4 flex items-center">
          <Table class="h-5 w-5 mr-2 text-secondary-600" />
          {{ language === 'de' ? 'Listengenerator' : 'List Generator' }}
        </h2>
        <p class="text-gray-600 dark:text-slate-400 mb-4">
          {{ language === 'de' 
            ? 'Erstellen Sie benutzerdefinierte Listen und Berichte mit Gruppierungen und Aggregationen.' 
            : 'Create custom lists and reports with groupings and aggregations.' }}
        </p>
        <button @click="showListGeneratorModal = true" class="w-full btn-primary">
          {{ language === 'de' ? 'Liste erstellen' : 'Create List' }}
        </button>
      </div>
      
      <!-- Template Wizard -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4 flex items-center">
          <Variable class="h-5 w-5 mr-2 text-accent-600" />
          {{ language === 'de' ? 'Vorlagen-Assistent' : 'Template Wizard' }}
        </h2>
        <p class="text-gray-600 dark:text-slate-400 mb-4">
          {{ language === 'de' 
            ? 'Verwenden Sie den Assistenten, um Vorlagen mit Variablen, Formatierung und Bedingungen zu erstellen.' 
            : 'Use the wizard to create templates with variables, formatting, and conditions.' }}
        </p>
        <button @click="showWizardModal = true" class="w-full btn-primary">
          {{ language === 'de' ? 'Assistent starten' : 'Start Wizard' }}
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4">
        {{ language === 'de' ? 'Letzte Aktivitäten' : 'Recent Activity' }}
      </h2>
      <div class="space-y-4">
        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
            <component :is="getActivityIcon(activity.action)" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium text-gray-900 dark:text-slate-50">{{ activity.user }}</p>
                <p class="text-sm text-gray-600 dark:text-slate-400">{{ activity.action }} <span class="font-medium">{{ activity.template }}</span></p>
              </div>
              <span class="text-xs text-gray-500 dark:text-slate-400">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Template Modal -->
    <div v-if="showTemplateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neue Vorlage erstellen' : 'Create New Template' }}
            </h3>
            <button @click="showTemplateModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <TemplateWizard 
            :categories="categories"
            :templates="templates"
            :search-macros="searchMacros"
            @finish="createTemplate"
            @cancel="showTemplateModal = false"
          />
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Vorlagen importieren' : 'Import Templates' }}
            </h3>
            <button @click="showImportModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <TemplateImportExport
            :isImport="true"
            :templates="templates"
            :onCancel="() => showImportModal = false"
            :onProcess="handleImport"
          />
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Vorlagen exportieren' : 'Export Templates' }}
            </h3>
            <button @click="showExportModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <TemplateImportExport 
            :is-import="false"
            :templates="templates"
            @process="exportTemplates"
            @cancel="showExportModal = false"
          />
        </div>
      </div>
    </div>

    <!-- Correspondence Modal -->
    <div v-if="showCorrespondenceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Individuelle Korrespondenz' : 'Individual Correspondence' }}
            </h3>
            <button @click="showCorrespondenceModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <CorrespondenceEditor 
            :templates="wordTemplates"
            :recipients="recipients"
            @create="createCorrespondence"
            @cancel="showCorrespondenceModal = false"
          />
        </div>
      </div>
    </div>

    <!-- List Generator Modal -->
    <div v-if="showListGeneratorModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Listengenerator' : 'List Generator' }}
            </h3>
            <button @click="showListGeneratorModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <ListGenerator 
            @preview="previewList"
            @save="saveList"
          />
        </div>
      </div>
    </div>

    <!-- Wizard Modal -->
    <div v-if="showWizardModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Vorlagen-Assistent' : 'Template Wizard' }}
            </h3>
            <button @click="showWizardModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <TemplateWizard 
            :categories="categories"
            :templates="templates"
            :search-macros="searchMacros"
            @finish="createTemplate"
            @cancel="showWizardModal = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  Plus, Search, Edit, Copy, X, Upload, Download, Printer, 
  FileText, FileOutput, SearchX, Variable, Table,
  LifeBuoy
} from 'lucide-vue-next'
import TemplateWizard from '../components/printing/TemplateWizard.vue'
import TemplateImportExport from '../components/printing/TemplateImportExport.vue'
import CorrespondenceEditor from '../components/printing/CorrespondenceEditor.vue'
import ListGenerator from '../components/printing/ListGenerator.vue'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const searchQuery = ref('')
const selectedCategory = ref<any>(null)
const templateTypeFilter = ref('')

// Modals
const showTemplateModal = ref(false)
const showImportModal = ref(false)
const showExportModal = ref(false)
const showCorrespondenceModal = ref(false)
const showListGeneratorModal = ref(false)
const showWizardModal = ref(false)

// Sample data
const categories = ref([
  {
    id: '1',
    name: language.value === 'de' ? 'Allgemeine Korrespondenz' : 'General Correspondence',
    description: language.value === 'de' ? 'Briefe und Mitteilungen' : 'Letters and communications',
    templates: ['1', '2', '3']
  },
  {
    id: '2',
    name: language.value === 'de' ? 'Zeugnisse' : 'Certificates',
    description: language.value === 'de' ? 'Schulzeugnisse und Bescheinigungen' : 'School certificates and attestations',
    templates: ['4', '5']
  },
  {
    id: '3',
    name: language.value === 'de' ? 'Listen & Berichte' : 'Lists & Reports',
    description: language.value === 'de' ? 'Schülerlisten und statistische Berichte' : 'Student lists and statistical reports',
    templates: ['6', '7', '8']
  },
  {
    id: '4',
    name: language.value === 'de' ? 'Elternbriefe' : 'Parent Letters',
    description: language.value === 'de' ? 'Kommunikation mit Eltern' : 'Communication with parents',
    templates: ['9', '10']
  }
])

const templates = ref([
  {
    id: '1',
    name: 'Student Report Card',
    type: 'WW',
    recordType: 'student',
    categoryId: 'academic',
    lastModified: '2024-01-15'
  },
  {
    id: '2',
    name: 'Attendance Report',
    type: 'WS',
    recordType: 'student',
    categoryId: 'academic',
    lastModified: '2024-01-10'
  },
  {
    id: '3',
    name: 'Grade Report',
    type: 'WW',
    recordType: 'student',
    categoryId: 'academic',
    lastModified: '2024-01-12'
  }
])

const recentActivity = ref([
  {
    id: '1',
    user: 'Admin Master',
    action: language.value === 'de' ? 'hat erstellt' : 'created',
    template: language.value === 'de' ? 'Standardbrief' : 'Standard Letter',
    time: '2 hours ago'
  },
  {
    id: '2',
    user: 'Sarah Fischer',
    action: language.value === 'de' ? 'hat bearbeitet' : 'edited',
    template: language.value === 'de' ? 'Halbjahreszeugnis' : 'Mid-Year Report Card',
    time: '5 hours ago'
  },
  {
    id: '3',
    user: 'Dr. Thomas Weber',
    action: language.value === 'de' ? 'hat gedruckt' : 'printed',
    template: language.value === 'de' ? 'Klassenliste' : 'Class List',
    time: '1 day ago'
  },
  {
    id: '4',
    user: 'Admin Master',
    action: language.value === 'de' ? 'hat importiert' : 'imported',
    template: '5 templates',
    time: '2 days ago'
  }
])

const searchMacros = ref([
  {
    id: '1',
    name: language.value === 'de' ? 'Minderjährige ohne Erziehungsberechtigten' : 'Minors without Guardian',
    description: language.value === 'de' ? 'Schüler unter 18 Jahre ohne Erziehungsberechtigten' : 'Students under 18 years without a guardian'
  },
  {
    id: '2',
    name: language.value === 'de' ? 'Abschlussklasse 2024' : 'Graduating Class 2024',
    description: language.value === 'de' ? 'Schüler, die 2024 ihren Abschluss machen' : 'Students graduating in 2024'
  }
])

const recipients = ref([
  { id: '1', name: 'Emma Müller', type: 'student' },
  { id: '2', name: 'Liam Weber', type: 'student' },
  { id: '3', name: 'Sophie Schmidt', type: 'student' },
  { id: '4', name: 'Class 10A', type: 'class' },
  { id: '5', name: 'Dr. Thomas Weber', type: 'teacher' }
])

// Computed properties
const allTemplatesCount = computed(() => templates.value.length)

const filteredTemplates = computed(() => {
  let filtered = templates.value
  
  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(template => template.categoryId === selectedCategory.value.id)
  }
  
  // Filter by type
  if (templateTypeFilter.value) {
    filtered = filtered.filter(template => template.type === templateTypeFilter.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(template => 
      template.name.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const wordTemplates = computed(() => {
  return templates.value.filter(template => template.type === 'WW')
})

// Methods
const getTemplateTypeIcon = (type: string) => {
  switch (type) {
    case 'WW':
      return FileText
    case 'WS':
      return FileOutput
    default:
      return FileText
  }
}

const getTemplateTypeColor = (type: string) => {
  switch (type) {
    case 'WW':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'WS':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getRecordTypeDisplay = (recordType: string) => {
  const recordTypes: Record<string, string> = {
    students: language.value === 'de' ? 'Schüler' : 'Students',
    classes: language.value === 'de' ? 'Klassen' : 'Classes',
    teachers: language.value === 'de' ? 'Lehrer' : 'Teachers',
    grades: language.value === 'de' ? 'Noten' : 'Grades',
    attendance: language.value === 'de' ? 'Anwesenheit' : 'Attendance'
  }
  
  return recordTypes[recordType] || recordType
}

const getActivityIcon = (action: string) => {
  if (action.includes('created') || action.includes('erstellt')) return Plus
  if (action.includes('edited') || action.includes('bearbeitet')) return Edit
  if (action.includes('printed') || action.includes('gedruckt')) return Printer
  if (action.includes('imported') || action.includes('importiert')) return Upload
  if (action.includes('exported') || action.includes('exportiert')) return Download
  return FileText
}

const viewTemplate = (template: any) => {
  alert(`${language.value === 'de' ? 'Vorlage anzeigen' : 'View template'}: ${template.name}`)
}

const editTemplate = (template: any) => {
  alert(`${language.value === 'de' ? 'Vorlage bearbeiten' : 'Edit template'}: ${template.name}`)
}

const copyTemplate = (template: any) => {
  alert(`${language.value === 'de' ? 'Vorlage kopieren' : 'Copy template'}: ${template.name}`)
}

const printTemplate = (template: any) => {
  alert(`${language.value === 'de' ? 'Vorlage drucken' : 'Print template'}: ${template.name}`)
}

const createTemplate = () => {
  alert(language.value === 'de' ? 'Neue Vorlage erstellt!' : 'New template created!')
  showTemplateModal.value = false
  showWizardModal.value = false
}

const exportTemplates = () => {
  alert(language.value === 'de' ? 'Vorlagen exportiert!' : 'Templates exported!')
  showExportModal.value = false
}

const createCorrespondence = () => {
  alert(language.value === 'de' ? 'Korrespondenz erstellt und in Word geöffnet!' : 'Correspondence created and opened in Word!')
  showCorrespondenceModal.value = false
}

const previewList = () => {
  alert(language.value === 'de' ? 'Listenvorschau wird angezeigt' : 'Showing list preview')
}

const saveList = () => {
  alert(language.value === 'de' ? 'Liste gespeichert!' : 'List saved!')
  showListGeneratorModal.value = false
}

const handleImport = () => {
  // Implementation of handleImport method
}
</script>
