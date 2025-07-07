<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary hover:bg-winschool-primary-dark rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <BarChart3 class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Statistiken' : 'Statistics' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten und ausführen von SQL-Abfragen für statistische Auswertungen' : 'Manage and execute SQL queries for statistical analysis' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showImportModal = true" class="w-full sm:w-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Upload class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Abfragen importieren' : 'Import Queries' }}
          </button>
          <button @click="showCreateQueryModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Abfrage erstellen' : 'Create Query' }}
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <component :is="tab.icon" class="h-5 w-5 inline mr-2" />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Query List Tab -->
        <div v-if="activeTab === 'list'" class="p-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Verfügbare Abfragen' : 'Available Queries' }}
            </h3>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="language === 'de' ? 'Abfragen suchen...' : 'Search queries...'"
                class="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select v-model="categoryFilter" class="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">{{ language === 'de' ? 'Alle Kategorien' : 'All Categories' }}</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div 
              v-for="query in filteredQueries" 
              :key="query.id"
              class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
              @click="selectQuery(query)"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-2">{{ query.name }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ query.description }}</p>
                </div>
                <div class="ml-4">
                  <span :class="getCategoryColor(query.category)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ query.category }}
                  </span>
                </div>
              </div>

              <div class="space-y-2 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Erstellt' : 'Created' }}</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(query.createdAt) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Letzte Ausführung' : 'Last Run' }}</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ query.lastRun ? formatDate(query.lastRun) : (language === 'de' ? 'Nie' : 'Never') }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Ausführungen' : 'Executions' }}</span>
                  <span class="font-medium text-green-600">{{ query.executionCount }}</span>
                </div>
              </div>

              <div class="flex space-x-2">
                <button @click.stop="runQuery(query)" class="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center">
                  <Play class="h-4 w-4 mr-1" />
                  {{ language === 'de' ? 'Ausführen' : 'Execute' }}
                </button>
                <button @click.stop="editQuery(query)" class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Edit3 class="h-4 w-4" />
                </button>
                <button @click.stop="deleteQuery(query)" class="px-3 py-2 text-sm border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Query Editor Tab -->
        <div v-if="activeTab === 'editor'" class="p-6">
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ editingQuery ? (language === 'de' ? 'Abfrage bearbeiten' : 'Edit Query') : (language === 'de' ? 'Neue Abfrage erstellen' : 'Create New Query') }}
              </h3>
              <div class="flex space-x-2">
                <button @click="resetEditor" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                  {{ language === 'de' ? 'Zurücksetzen' : 'Reset' }}
                </button>
                <button @click="saveQuery" class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  {{ language === 'de' ? 'Speichern' : 'Save' }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Abfragename' : 'Query Name' }} <span class="text-red-500">*</span>
                  </label>
                  <input v-model="queryForm.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Kategorie' : 'Category' }} <span class="text-red-500">*</span>
                  </label>
                  <select v-model="queryForm.category" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">{{ language === 'de' ? 'Kategorie auswählen...' : 'Select category...' }}</option>
                    <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Beschreibung' : 'Description' }}
                  </label>
                  <textarea v-model="queryForm.description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Parameter' : 'Parameters' }}
                  </label>
                  <div class="space-y-2">
                    <div v-for="(param, index) in queryForm.parameters" :key="index" class="flex space-x-2">
                      <input v-model="param.name" :placeholder="language === 'de' ? 'Parameter-Name' : 'Parameter name'" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                      <select v-model="param.type" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="boolean">Boolean</option>
                      </select>
                      <button @click="removeParameter(index)" class="px-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <X class="h-4 w-4" />
                      </button>
                    </div>
                    <button @click="addParameter" class="w-full px-3 py-2 text-sm border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                      {{ language === 'de' ? 'Parameter hinzufügen' : 'Add Parameter' }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'SQL-Abfrage' : 'SQL Query' }} <span class="text-red-500">*</span>
                  </label>
                  <textarea 
                    v-model="queryForm.sql" 
                    rows="12" 
                    required 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    :placeholder="language === 'de' ? 'SQL-Abfrage eingeben...' : 'Enter SQL query...'"
                  ></textarea>
                </div>

                <div class="flex space-x-2">
                  <button @click="validateQuery" class="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <CheckCircle class="h-4 w-4 inline mr-2" />
                    {{ language === 'de' ? 'Validieren' : 'Validate' }}
                  </button>
                  <button @click="testQuery" class="flex-1 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Play class="h-4 w-4 inline mr-2" />
                    {{ language === 'de' ? 'Testen' : 'Test' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Tab -->
        <div v-if="activeTab === 'results'" class="p-6">
          <div v-if="!currentResults" class="text-center py-12">
            <BarChart3 class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ language === 'de' ? 'Keine Ergebnisse' : 'No Results' }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ language === 'de' ? 'Führen Sie eine Abfrage aus, um Ergebnisse zu sehen' : 'Execute a query to see results' }}
            </p>
          </div>

          <div v-else class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ currentResults.queryName }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ language === 'de' ? 'Ausgeführt am' : 'Executed on' }} {{ formatDateTime(currentResults.executedAt) }}
                  • {{ currentResults.rows.length }} {{ language === 'de' ? 'Zeilen' : 'rows' }}
                  • {{ currentResults.executionTime }}ms
                </p>
              </div>
              <div class="flex space-x-2">
                <button @click="exportResults('csv')" class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                  <Download class="h-4 w-4 inline mr-2" />
                  CSV
                </button>
                <button @click="exportResults('excel')" class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                  <Download class="h-4 w-4 inline mr-2" />
                  Excel
                </button>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th v-for="column in currentResults.columns" :key="column" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {{ column }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(row, index) in paginatedResults" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td v-for="column in currentResults.columns" :key="column" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {{ row[column] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div v-if="currentResults.rows.length > resultsPerPage" class="bg-gray-50 dark:bg-gray-900 px-6 py-3 flex items-center justify-between">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  {{ language === 'de' ? 'Zeige' : 'Showing' }} 
                  {{ (currentResultsPage - 1) * resultsPerPage + 1 }} 
                  {{ language === 'de' ? 'bis' : 'to' }} 
                  {{ Math.min(currentResultsPage * resultsPerPage, currentResults.rows.length) }} 
                  {{ language === 'de' ? 'von' : 'of' }} 
                  {{ currentResults.rows.length }} 
                  {{ language === 'de' ? 'Ergebnissen' : 'results' }}
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="currentResultsPage--" 
                    :disabled="currentResultsPage === 1"
                    class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ language === 'de' ? 'Zurück' : 'Previous' }}
                  </button>
                  <button 
                    @click="currentResultsPage++"
                    :disabled="currentResultsPage >= Math.ceil(currentResults.rows.length / resultsPerPage)"
                    class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ language === 'de' ? 'Weiter' : 'Next' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Import Modal -->
      <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Abfragen importieren' : 'Import Queries' }}
            </h3>
            <button @click="showImportModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="p-6 space-y-6">
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <input
                ref="fileInput"
                type="file"
                accept=".txt,.sql"
                @change="handleFileUpload"
                class="hidden"
              />
              <Upload class="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {{ language === 'de' ? 'Datei auswählen' : 'Select File' }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {{ language === 'de' ? 'Unterstützte Formate: .txt, .sql (ANSI-kodiert)' : 'Supported formats: .txt, .sql (ANSI encoded)' }}
              </p>
              <button @click="fileInput?.click()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                {{ language === 'de' ? 'Datei wählen' : 'Choose File' }}
              </button>
            </div>

            <div v-if="importPreview.length > 0" class="space-y-4">
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Vorschau' : 'Preview' }} ({{ importPreview.length }} {{ language === 'de' ? 'Abfragen gefunden' : 'queries found' }})
              </h4>
              <div class="max-h-64 overflow-y-auto space-y-2">
                <div v-for="(query, index) in importPreview" :key="index" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-900 dark:text-white">{{ query.name }}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ query.category }}</span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ query.description }}</p>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button @click="showImportModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button @click="importQueries" :disabled="importPreview.length === 0" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg">
                {{ language === 'de' ? 'Importieren' : 'Import' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Query Modal -->
      <div v-if="showCreateQueryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neue Abfrage erstellen' : 'Create New Query' }}
            </h3>
            <button @click="showCreateQueryModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="p-6">
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              {{ language === 'de' ? 'Möchten Sie eine neue Abfrage erstellen oder zum Editor wechseln?' : 'Would you like to create a new query or switch to the editor?' }}
            </p>
            <div class="flex space-x-3">
              <button @click="createNewQuery" class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                {{ language === 'de' ? 'Zum Editor' : 'Go to Editor' }}
              </button>
              <button @click="showCreateQueryModal = false" class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  BarChart3, Download, Upload, Plus, Trash2
} from 'lucide-vue-next'

// --- Domain Types (see autocoding/context/ and frontend patterns) ---
interface QueryParameter {
  name: string;
  type: string;
}

interface QueryForm {
  name: string;
  category: string;
  description: string;
  sql: string;
  parameters: QueryParameter[];
}

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const activeTab = ref('list')
const searchQuery = ref('')
const categoryFilter = ref('')
const showImportModal = ref(false)
const showCreateQueryModal = ref(false)
const editingQuery = ref<any>(null)
const currentResults = ref<any>(null)
const currentResultsPage = ref(1)
const resultsPerPage = ref(50)
const importPreview = ref<any[]>([])

// Query form
const queryForm = ref<QueryForm>({
  name: '',
  category: '',
  description: '',
  sql: '',
  parameters: []
})

// Add proper typing for file input ref
const fileInput = ref<HTMLInputElement>()

// Mock data
const categories = ref([
  'Student Analytics',
  'Academic Performance',
  'Attendance',
  'Financial',
  'Enrollment',
  'Staff Reports'
])

const queries = ref([
  {
    id: '1',
    name: 'Student Enrollment by Grade',
    description: 'Shows enrollment numbers broken down by grade level for the current academic year',
    category: 'Enrollment',
    sql: 'SELECT grade, COUNT(*) as enrollment_count FROM students WHERE academic_year = @year GROUP BY grade ORDER BY grade',
    parameters: [{ name: 'year', type: 'string' }],
    createdAt: new Date('2024-01-15'),
    lastRun: new Date('2024-01-20'),
    executionCount: 15
  },
  {
    id: '2',
    name: 'Average Grades by Subject',
    description: 'Calculates average grades for each subject across all classes',
    category: 'Academic Performance',
    sql: 'SELECT subject_name, AVG(grade_value) as average_grade FROM grades g JOIN subjects s ON g.subject_id = s.id WHERE semester = @semester GROUP BY subject_name',
    parameters: [{ name: 'semester', type: 'string' }],
    createdAt: new Date('2024-01-10'),
    lastRun: new Date('2024-01-18'),
    executionCount: 23
  },
  {
    id: '3',
    name: 'Attendance Rate by Class',
    description: 'Shows attendance percentages for each class in the selected time period',
    category: 'Attendance',
    sql: 'SELECT class_name, (SUM(present) * 100.0 / COUNT(*)) as attendance_rate FROM attendance a JOIN classes c ON a.class_id = c.id WHERE date BETWEEN @start_date AND @end_date GROUP BY class_name',
    parameters: [{ name: 'start_date', type: 'date' }, { name: 'end_date', type: 'date' }],
    createdAt: new Date('2024-01-08'),
    lastRun: null,
    executionCount: 5
  }
])

const tabs = [
  { id: 'list', label: language.value === 'de' ? 'Abfragen' : 'Queries', icon: BarChart3 },
  { id: 'editor', label: language.value === 'de' ? 'Editor' : 'Editor', icon: BarChart3 },
  { id: 'import', label: language.value === 'de' ? 'Import' : 'Import', icon: Upload },
  { id: 'export', label: language.value === 'de' ? 'Export' : 'Export', icon: Download }
]

// Computed
const filteredQueries = computed(() => {
  let filtered = queries.value

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(q => 
      q.name.toLowerCase().includes(search) ||
      q.description.toLowerCase().includes(search)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(q => q.category === categoryFilter.value)
  }

  return filtered
})

const paginatedResults = computed(() => {
  if (!currentResults.value) return []
  
  const start = (currentResultsPage.value - 1) * resultsPerPage.value
  const end = start + resultsPerPage.value
  return currentResults.value.rows.slice(start, end)
})

// Methods
const getCategoryColor = (category: string) => {
  const colors = {
    'Student Analytics': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Academic Performance': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Attendance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'Financial': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'Enrollment': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    'Staff Reports': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US')
}

const formatDateTime = (date: Date) => {
  return date.toLocaleString(language.value === 'de' ? 'de-DE' : 'en-US')
}

const selectQuery = (query: any) => {
  console.log('Selected query:', query)
  // Could open a detailed view or populate the editor
}

const runQuery = async (query: any) => {
  console.log('Running query:', query)
  
  // Mock execution
  const mockResults = {
    queryName: query.name,
    executedAt: new Date(),
    executionTime: 150,
    columns: ['Column 1', 'Column 2', 'Column 3', 'Column 4'],
    rows: Array.from({ length: 25 }, (_, i) => ({
      'Column 1': `Value ${i + 1}`,
      'Column 2': Math.floor(Math.random() * 100),
      'Column 3': new Date().toLocaleDateString(),
      'Column 4': ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)]
    }))
  }
  
  currentResults.value = mockResults
  currentResultsPage.value = 1
  activeTab.value = 'results'
  
  // Update execution count
  query.lastRun = new Date()
  query.executionCount++
}

const editQuery = (query: any) => {
  editingQuery.value = query
  queryForm.value = {
    name: query.name,
    category: query.category,
    description: query.description,
    sql: query.sql,
    parameters: [...query.parameters]
  }
  activeTab.value = 'editor'
}

const deleteQuery = (query: any) => {
  if (confirm(language.value === 'de' ? `Abfrage "${query.name}" löschen?` : `Delete query "${query.name}"?`)) {
    const index = queries.value.findIndex(q => q.id === query.id)
    if (index > -1) {
      queries.value.splice(index, 1)
    }
  }
}

const createNewQuery = () => {
  editingQuery.value = null
  queryForm.value = {
    name: '',
    category: '',
    description: '',
    sql: '',
    parameters: []
  }
  showCreateQueryModal.value = false
  activeTab.value = 'editor'
}

const resetEditor = () => {
  editingQuery.value = null
  queryForm.value = {
    name: '',
    category: '',
    description: '',
    sql: '',
    parameters: []
  }
}

const addParameter = () => {
  queryForm.value.parameters.push({ name: '', type: 'string' })
}

const removeParameter = (index: number) => {
  queryForm.value.parameters.splice(index, 1)
}

const validateQuery = () => {
  // Mock validation
  alert(language.value === 'de' ? 'SQL-Syntax ist gültig!' : 'SQL syntax is valid!')
}

const testQuery = () => {
  // Mock test execution
  const testQueryData = {
    ...queryForm.value,
    name: queryForm.value.name || 'Test Query'
  }
  runQuery(testQueryData)
}

const saveQuery = () => {
  if (editingQuery.value) {
    // Update existing query
    Object.assign(editingQuery.value, queryForm.value)
  } else {
    // Create new query
    const newQuery = {
      id: String(queries.value.length + 1),
      createdAt: new Date(),
      lastRun: null,
      executionCount: 0,
      ...queryForm.value
    }
    queries.value.push(newQuery)
  }
  
  alert(language.value === 'de' ? 'Abfrage gespeichert!' : 'Query saved!')
  activeTab.value = 'list'
}

const handleFileUpload = (event: any) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    parseImportFile(content)
  }
  reader.readAsText(file, 'windows-1252') // ANSI encoding
}

const parseImportFile = (content: string) => {
  // Mock parsing of abfragenhh.txt format
  const lines = content.split('\n').filter(line => line.trim())
  const parsed = []
  
  for (let i = 0; i < lines.length; i += 3) {
    if (i + 2 < lines.length) {
      const name = lines[i].replace(/"/g, '').split(';')[0]
      const category = lines[i].replace(/"/g, '').split(';')[1] || 'General'
      const description = lines[i + 1].replace(/"/g, '')
      const sql = lines[i + 2].replace(/"/g, '')
      
      parsed.push({ name, category, description, sql, parameters: [] })
    }
  }
  
  importPreview.value = parsed
}

const importQueries = () => {
  importPreview.value.forEach(query => {
    const newQuery = {
      id: String(queries.value.length + 1),
      ...query,
      createdAt: new Date(),
      lastRun: null,
      executionCount: 0
    }
    queries.value.push(newQuery)
  })
  
  showImportModal.value = false
  importPreview.value = []
  alert(language.value === 'de' ? `${importPreview.value.length} Abfragen importiert!` : `${importPreview.value.length} queries imported!`)
}

const exportResults = (format: 'csv' | 'excel') => {
  console.log(`Exporting results as ${format}`)
  // Mock export functionality
  alert(language.value === 'de' ? `Ergebnisse als ${format.toUpperCase()} exportiert!` : `Results exported as ${format.toUpperCase()}!`)
}
</script> 