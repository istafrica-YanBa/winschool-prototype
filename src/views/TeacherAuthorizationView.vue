<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary hover:bg-winschool-primary-dark rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <UserCheck class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Lehrer-Autorisierung' : 'Teacher Authorization' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Login-Namen und aktivieren Sie nicht zugewiesene Lehrer' : 'Manage login names and activate unassigned teachers' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="syncWithDatabase" class="w-full sm:w-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <RefreshCw class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Synchronisieren' : 'Sync' }}
          </button>
          <button @click="showBulkCreateModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <UserPlus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Massenerstellung' : 'Bulk Create' }}
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <UserX class="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Ohne Login' : 'Without Login' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ unauthorizedTeachers.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <UserCheck class="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Autorisiert' : 'Authorized' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ authorizedTeachers.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Clock class="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Ausstehend' : 'Pending' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pendingTeachers.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
              <Users class="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Gesamt' : 'Total' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ allTeachers.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="language === 'de' ? 'Lehrer suchen...' : 'Search teachers...'"
              class="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select v-model="statusFilter" class="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
              <option value="unauthorized">{{ language === 'de' ? 'Ohne Login' : 'No Login' }}</option>
              <option value="pending">{{ language === 'de' ? 'Ausstehend' : 'Pending' }}</option>
              <option value="authorized">{{ language === 'de' ? 'Autorisiert' : 'Authorized' }}</option>
            </select>
            <select v-model="departmentFilter" class="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">{{ language === 'de' ? 'Alle Abteilungen' : 'All Departments' }}</option>
              <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Teachers List -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Lehrerverwaltung' : 'Teacher Management' }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ filteredTeachers.length }} {{ language === 'de' ? 'Lehrer gefunden' : 'teachers found' }}
          </p>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ language === 'de' ? 'Abteilung' : 'Department' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ language === 'de' ? 'Login-Name' : 'Login Name' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ language === 'de' ? 'Status' : 'Status' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="teacher in paginatedTeachers" :key="teacher.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                      <User class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ teacher.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ teacher.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ teacher.department }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="teacher.loginName" class="text-sm font-mono text-gray-900 dark:text-white">{{ teacher.loginName }}</div>
                  <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">{{ language === 'de' ? 'Nicht zugewiesen' : 'Not assigned' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusColor(teacher.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getStatusText(teacher.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button v-if="teacher.status === 'unauthorized'" @click="assignLogin(teacher)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      {{ language === 'de' ? 'Login zuweisen' : 'Assign Login' }}
                    </button>
                    <button v-if="teacher.status === 'pending'" @click="activateUser(teacher)" class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20">
                      {{ language === 'de' ? 'Aktivieren' : 'Activate' }}
                    </button>
                    <button v-if="teacher.status === 'authorized'" @click="managePermissions(teacher)" class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 px-2 py-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      {{ language === 'de' ? 'Berechtigungen' : 'Permissions' }}
                    </button>
                    <button @click="editTeacher(teacher)" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-900/20">
                      <Edit3 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden p-6 space-y-4">
          <div v-for="teacher in paginatedTeachers" :key="teacher.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                  <User class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ teacher.name }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ teacher.email }}</p>
                </div>
              </div>
              <span :class="getStatusColor(teacher.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
                {{ getStatusText(teacher.status) }}
              </span>
            </div>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Abteilung' : 'Department' }}</span>
                <span class="text-gray-900 dark:text-white">{{ teacher.department }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Login-Name' : 'Login Name' }}</span>
                <span class="text-gray-900 dark:text-white font-mono">{{ teacher.loginName || (language === 'de' ? 'Nicht zugewiesen' : 'Not assigned') }}</span>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <button v-if="teacher.status === 'unauthorized'" @click="assignLogin(teacher)" class="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg">
                {{ language === 'de' ? 'Login zuweisen' : 'Assign Login' }}
              </button>
              <button v-if="teacher.status === 'pending'" @click="activateUser(teacher)" class="px-3 py-1 text-xs bg-green-600 text-white rounded-lg">
                {{ language === 'de' ? 'Aktivieren' : 'Activate' }}
              </button>
              <button v-if="teacher.status === 'authorized'" @click="managePermissions(teacher)" class="px-3 py-1 text-xs bg-purple-600 text-white rounded-lg">
                {{ language === 'de' ? 'Berechtigungen' : 'Permissions' }}
              </button>
              <button @click="editTeacher(teacher)" class="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg">
                {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredTeachers.length > teachersPerPage" class="bg-gray-50 dark:bg-gray-900 px-6 py-3 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            {{ language === 'de' ? 'Zeige' : 'Showing' }} 
            {{ (currentPage - 1) * teachersPerPage + 1 }} 
            {{ language === 'de' ? 'bis' : 'to' }} 
            {{ Math.min(currentPage * teachersPerPage, filteredTeachers.length) }} 
            {{ language === 'de' ? 'von' : 'of' }} 
            {{ filteredTeachers.length }} 
            {{ language === 'de' ? 'Lehrern' : 'teachers' }}
          </div>
          <div class="flex space-x-2">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ language === 'de' ? 'Zurück' : 'Previous' }}
            </button>
            <button 
              @click="currentPage++"
              :disabled="currentPage >= Math.ceil(filteredTeachers.length / teachersPerPage)"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ language === 'de' ? 'Weiter' : 'Next' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Assign Login Modal -->
      <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Login-Namen zuweisen' : 'Assign Login Name' }}
            </h3>
            <button @click="showAssignModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <form @submit.prevent="confirmAssignLogin" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
              </label>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedTeacher?.name }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ selectedTeacher?.email }}</p>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Login-Name' : 'Login Name' }} <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="loginForm.loginName" 
                type="text" 
                required 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :placeholder="language === 'de' ? 'z.B. j.doe' : 'e.g. j.doe'"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ language === 'de' ? 'Verwenden Sie nur Kleinbuchstaben, Zahlen und Punkte' : 'Use only lowercase letters, numbers, and dots' }}
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Temporäres Passwort' : 'Temporary Password' }}
              </label>
              <input 
                v-model="loginForm.tempPassword" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :placeholder="language === 'de' ? 'Automatisch generiert' : 'Auto-generated'"
              />
            </div>
            
            <div class="flex items-center">
              <input v-model="loginForm.sendEmail" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {{ language === 'de' ? 'Login-Daten per E-Mail senden' : 'Send login details via email' }}
              </label>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button type="button" @click="showAssignModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                {{ language === 'de' ? 'Login zuweisen' : 'Assign Login' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Bulk Assignment Modal -->
      <div v-if="showBulkAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Benutzer massenweise erstellen' : 'Bulk Create Users' }}
            </h3>
            <button @click="showBulkAssignModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="p-6">
            <div class="mb-6">
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ language === 'de' ? 'Wählen Sie Lehrer aus, für die automatisch Benutzerkonten erstellt werden sollen:' : 'Select teachers to automatically create user accounts for:' }}
              </p>
              <div class="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                <div v-for="teacher in unauthorizedTeachers" :key="teacher.id" class="p-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                  <label class="flex items-center">
                    <input v-model="bulkSelection" :value="teacher.id" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <div class="ml-3 flex-1">
                      <p class="font-medium text-gray-900 dark:text-white">{{ teacher.name }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ teacher.email }} • {{ teacher.department }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="space-y-4 mb-6">
              <div class="flex items-center">
                <input v-model="bulkOptions.autoGeneratePasswords" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {{ language === 'de' ? 'Passwörter automatisch generieren' : 'Auto-generate passwords' }}
                </label>
              </div>
              <div class="flex items-center">
                <input v-model="bulkOptions.sendWelcomeEmails" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {{ language === 'de' ? 'Willkommens-E-Mails senden' : 'Send welcome emails' }}
                </label>
              </div>
              <div class="flex items-center">
                <input v-model="bulkOptions.activateImmediately" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {{ language === 'de' ? 'Sofort aktivieren' : 'Activate immediately' }}
                </label>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button @click="showBulkAssignModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button @click="processBulkAssignment" :disabled="bulkSelection.length === 0" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg">
                {{ language === 'de' ? `${bulkSelection.length} Benutzer erstellen` : `Create ${bulkSelection.length} Users` }}
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
  UserCheck, UserPlus, UserX, Clock, Users, User, Edit3, X, RefreshCw
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const searchQuery = ref('')
const statusFilter = ref('')
const departmentFilter = ref('')
const currentPage = ref(1)
const teachersPerPage = ref(10)
const showAssignModal = ref(false)
const showBulkAssignModal = ref(false)
const selectedTeacher = ref<any>(null)
const bulkSelection = ref<string[]>([])
const showBulkCreateModal = ref(false)

// Form data
const loginForm = ref({
  loginName: '',
  tempPassword: '',
  sendEmail: true
})

const bulkOptions = ref({
  autoGeneratePasswords: true,
  sendWelcomeEmails: true,
  activateImmediately: false
})

// Mock data
const departments = ref([
  'Mathematics',
  'Science',
  'Languages',
  'Social Studies',
  'Arts',
  'Physical Education'
])

const allTeachers = ref([
  {
    id: '1',
    name: 'Dr. Sarah Miller',
    email: 's.miller@school.edu',
    department: 'Mathematics',
    loginName: 's.miller',
    status: 'authorized',
    lastLogin: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'John Thompson',
    email: 'j.thompson@school.edu',
    department: 'Science',
    loginName: null,
    status: 'unauthorized',
    lastLogin: null
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'e.rodriguez@school.edu',
    department: 'Languages',
    loginName: 'e.rodriguez',
    status: 'pending',
    lastLogin: null
  },
  {
    id: '4',
    name: 'Michael Chen',
    email: 'm.chen@school.edu',
    department: 'Social Studies',
    loginName: null,
    status: 'unauthorized',
    lastLogin: null
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'l.anderson@school.edu',
    department: 'Arts',
    loginName: 'l.anderson',
    status: 'authorized',
    lastLogin: new Date('2024-01-19')
  },
  {
    id: '6',
    name: 'David Wilson',
    email: 'd.wilson@school.edu',
    department: 'Physical Education',
    loginName: 'd.wilson',
    status: 'pending',
    lastLogin: null
  }
])

// Computed
const unauthorizedTeachers = computed(() => allTeachers.value.filter(t => t.status === 'unauthorized'))
const authorizedTeachers = computed(() => allTeachers.value.filter(t => t.status === 'authorized'))
const pendingTeachers = computed(() => allTeachers.value.filter(t => t.status === 'pending'))

const filteredTeachers = computed(() => {
  let filtered = allTeachers.value

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(search) ||
      t.email.toLowerCase().includes(search) ||
      (t.loginName && t.loginName.toLowerCase().includes(search))
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(t => t.status === statusFilter.value)
  }

  if (departmentFilter.value) {
    filtered = filtered.filter(t => t.department === departmentFilter.value)
  }

  return filtered
})

const paginatedTeachers = computed(() => {
  const start = (currentPage.value - 1) * teachersPerPage.value
  const end = start + teachersPerPage.value
  return filteredTeachers.value.slice(start, end)
})

// Methods
const getStatusColor = (status: string) => {
  switch (status) {
    case 'authorized':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'unauthorized':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getStatusText = (status: string) => {
  const statusTexts = {
    authorized: language.value === 'de' ? 'Autorisiert' : 'Authorized',
    pending: language.value === 'de' ? 'Ausstehend' : 'Pending',
    unauthorized: language.value === 'de' ? 'Ohne Login' : 'No Login'
  }
  return statusTexts[status as keyof typeof statusTexts] || status
}

const assignLogin = (teacher: any) => {
  selectedTeacher.value = teacher
  loginForm.value = {
    loginName: generateLoginName(teacher.name),
    tempPassword: generatePassword(),
    sendEmail: true
  }
  showAssignModal.value = true
}

const generateLoginName = (name: string) => {
  const parts = name.toLowerCase().split(' ')
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}.${parts[parts.length - 1]}`
  }
  return parts[0]
}

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

const confirmAssignLogin = () => {
  if (selectedTeacher.value) {
    selectedTeacher.value.loginName = loginForm.value.loginName
    selectedTeacher.value.status = 'pending'
    
    if (loginForm.value.sendEmail) {
      console.log('Sending login details to:', selectedTeacher.value.email)
    }
    
    showAssignModal.value = false
    selectedTeacher.value = null
    alert(language.value === 'de' ? 'Login-Name erfolgreich zugewiesen!' : 'Login name assigned successfully!')
  }
}

const activateUser = (teacher: any) => {
  if (confirm(language.value === 'de' ? `Benutzer "${teacher.name}" aktivieren?` : `Activate user "${teacher.name}"?`)) {
    teacher.status = 'authorized'
    teacher.lastLogin = new Date()
    alert(language.value === 'de' ? 'Benutzer erfolgreich aktiviert!' : 'User activated successfully!')
  }
}

const managePermissions = (teacher: any) => {
  console.log('Managing permissions for:', teacher.name)
  // Would open permissions management modal
}

const editTeacher = (teacher: any) => {
  console.log('Editing teacher:', teacher.name)
  // Would open teacher edit modal
}

const processBulkAssignment = () => {
  const selectedTeachers = allTeachers.value.filter(t => bulkSelection.value.includes(t.id))
  
  selectedTeachers.forEach(teacher => {
    teacher.loginName = generateLoginName(teacher.name)
    teacher.status = bulkOptions.value.activateImmediately ? 'authorized' : 'pending'
    
    if (bulkOptions.value.sendWelcomeEmails) {
      console.log('Sending welcome email to:', teacher.email)
    }
  })
  
  showBulkAssignModal.value = false
  bulkSelection.value = []
  alert(language.value === 'de' ? `${selectedTeachers.length} Benutzer erfolgreich erstellt!` : `${selectedTeachers.length} users created successfully!`)
}

const syncWithDatabase = async () => {
  // TODO: Implement database sync
  console.log('Syncing with database...')
}
</script> 