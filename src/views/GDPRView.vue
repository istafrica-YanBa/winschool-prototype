<template>
  <div class="gdpr-management bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Shield class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'DSGVO-Verwaltung' : 'GDPR Management' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Suchen und exportieren Sie Benutzerdaten für DSGVO-Berichte' : 'Search and export user data for GDPR reports' }}
          </p>
        </div>
      </div>

    </div>

    <!-- Search Filters -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
      <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
        {{ language === 'de' ? 'Benutzersuche' : 'User Search' }}
      </h2>
      
      <!-- Search Input Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Vorname' : 'First Name' }}
          </label>
          <input
            v-model="searchFilters.firstName"
            :placeholder="language === 'de' ? 'Vorname eingeben...' : 'Enter first name...'"
            class="block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 sm:text-sm"
            @keyup.enter="performSearch"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Nachname' : 'Last Name' }}
          </label>
          <input
            v-model="searchFilters.lastName"
            :placeholder="language === 'de' ? 'Nachname eingeben...' : 'Enter last name...'"
            class="block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 sm:text-sm"
            @keyup.enter="performSearch"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Datum (Bis)' : 'Date (Until)' }}
          </label>
          <input
            v-model="searchFilters.date"
            type="date"
            class="block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 sm:text-sm"
            @change="performSearch"
          />
        </div>
      </div>

      <!-- Role Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          {{ language === 'de' ? 'Suchen in:' : 'Search in:' }}
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="role in userRoles"
            :key="role.value"
            @click="toggleRole(role.value)"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              searchFilters.selectedRoles.includes(role.value)
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600'
            ]"
          >
            <component :is="role.icon" class="h-4 w-4 inline mr-2" />
            {{ role.label }}
          </button>
        </div>
      </div>

      <!-- Archive Search Toggle -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <input type="checkbox"
            v-model="searchFilters.includeArchive"
            id="includeArchive"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mr-2"
          />
          <label for="includeArchive" class="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            {{ language === 'de' ? 'In Archiv suchen' : 'Search in archive' }}
          </label>
        </div>
        
        <button
          @click="performSearch"
          :disabled="!canSearch"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <Search class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Suchen' : 'Search' }}
        </button>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-3 sm:space-y-0">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
          {{ language === 'de' ? 'Suchergebnisse' : 'Search Results' }}
          <span class="text-sm font-normal text-slate-500 dark:text-slate-400">
            ({{ searchResults.length }} {{ language === 'de' ? 'gefunden' : 'found' }})
          </span>
        </h2>
        <button
          v-if="selectedUsers.length > 0"
          @click="showExportModal = true"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Download class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Exportieren' : 'Export' }} ({{ selectedUsers.length }})
        </button>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <input type="checkbox"
                  v-model="selectAll"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  @change="toggleAllUsers"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Rolle' : 'Role' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'E-Mail' : 'Email' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Adresse' : 'Address' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Beitrittsdatum' : 'Joining Date' }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            <tr v-for="user in searchResults" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <input type="checkbox"
                  :checked="selectedUsers.includes(user.id)"
                  @change="toggleUser(user.id)"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    :src="user.avatar"
                    :alt="user.name"
                    class="h-8 w-8 rounded-full object-cover mr-3"
        />
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-slate-800 dark:text-slate-50 truncate">{{ user.name }}</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="getRoleColor(user.role)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getRoleDisplayName(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-800 dark:text-slate-50">
                {{ user.address.street }}, {{ user.address.city }}, {{ user.address.country }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                {{ formatDate(user.joiningDate) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="md:hidden space-y-3">
        <div v-for="user in searchResults" :key="user.id" class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-3">
          <div class="flex items-start justify-between">
            <div class="flex items-center flex-1">
              <input type="checkbox"
                :checked="selectedUsers.includes(user.id)"
                @change="toggleUser(user.id)"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mr-3"
              />
              <img
                :src="user.avatar"
                :alt="user.name"
                class="h-10 w-10 rounded-full object-cover mr-3"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-slate-800 dark:text-slate-50 truncate">{{ user.name }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ user.email }}</p>
              </div>
            </div>
            <span :class="getRoleColor(user.role)" class="px-2 py-1 text-xs font-medium rounded-full flex-shrink-0">
              {{ getRoleDisplayName(user.role) }}
            </span>
          </div>

          <div class="grid grid-cols-1 gap-2">
            <div>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ language === 'de' ? 'Adresse' : 'Address' }}</p>
              <p class="text-sm text-slate-800 dark:text-slate-50">{{ user.address.street }}, {{ user.address.city }}, {{ user.address.country }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ language === 'de' ? 'Beitrittsdatum' : 'Joining Date' }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ formatDate(user.joiningDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div v-else-if="hasSearched && searchResults.length === 0" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-12 text-center">
      <Search class="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-slate-800 dark:text-slate-50 mb-2">
        {{ language === 'de' ? 'Keine Ergebnisse gefunden' : 'No Results Found' }}
      </h3>
      <p class="text-slate-600 dark:text-slate-400">
        {{ language === 'de' ? 'Versuchen Sie es mit anderen Suchkriterien.' : 'Try adjusting your search criteria.' }}
      </p>
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'DSGVO-Bericht exportieren' : 'Export GDPR Report' }}
          </h3>
          <button @click="showExportModal = false" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X class="h-6 w-6" />
          </button>
        </div>

        <div class="space-y-4">
          <!-- Export Format -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Export-Format' : 'Export Format' }}
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="exportOptions.format = 'pdf'"
                :class="[
                  'p-3 rounded-lg border text-center transition-colors',
                  exportOptions.format === 'pdf'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                ]"
              >
                <FileText class="h-6 w-6 mx-auto mb-1" />
                <span class="text-sm font-medium">PDF</span>
              </button>
              <button
                @click="exportOptions.format = 'json'"
                :class="[
                  'p-3 rounded-lg border text-center transition-colors',
                  exportOptions.format === 'json'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                ]"
              >
                <FileText class="h-6 w-6 mx-auto mb-1" />
                <span class="text-sm font-medium">JSON</span>
              </button>
            </div>
          </div>

          <!-- Password Protection -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Passwort für Export' : 'Export Password' }}
            </label>
            <input
              v-model="exportOptions.password"
              type="password"
              :placeholder="language === 'de' ? 'Sicheres Passwort eingeben...' : 'Enter secure password...'"
              class="block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 sm:text-sm"
              required
            />
          </div>


        </div>

        <div class="flex space-x-3 mt-6">
          <button
            @click="showExportModal = false"
            class="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
          </button>
          <button
            @click="generateReport"
            :disabled="!canExport"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Printer class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Exportieren' : 'Export' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import {
  Shield, Search, Download, FileText, Printer, X,
  User, Users, UserCheck, Building
} from 'lucide-vue-next'

// --- Domain Types ---
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  joiningDate: string;
  archived: boolean;
}

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Search filters
const searchFilters = ref({
  firstName: '',
  lastName: '',
  date: '',
  selectedRoles: [] as string[],
  includeArchive: false
})

// Update userRoles to use a computed for label so it reacts to language changes
const userRoles = computed(() => [
  {
    value: 'student',
    label: language.value === 'de' ? 'Schüler' : 'Student',
    icon: User
  },
  {
    value: 'teacher',
    label: language.value === 'de' ? 'Lehrer' : 'Teacher',
    icon: Users
  },
  {
    value: 'parent',
    label: language.value === 'de' ? 'Eltern' : 'Parent',
    icon: User
  },
  {
    value: 'schoolstaff',
    label: language.value === 'de' ? 'Schulpersonal' : 'School Staff',
    icon: UserCheck
  },
  {
    value: 'admin',
    label: language.value === 'de' ? 'Administrator' : 'Administrator',
    icon: Building
  }
])

// Search results and state
const searchResults = ref<User[]>([])
const selectedUsers = ref<string[]>([])
const hasSearched = ref(false)
const showExportModal = ref(false)
const selectAll = ref(false)

// Export options
const exportOptions = ref({
  format: 'pdf',
  password: ''
})

// Mock search results data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Maria Müller',
    email: 'maria.mueller@school.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e5a8?w=150',
    address: {
      street: 'Westland 73b, 99999 Dortmund',
      city: 'Dortmund',
      country: 'Germany'
    },
    joiningDate: '2021-11-04',
    archived: false
  },
  {
    id: '2',
    name: 'Hans Schmidt',
    email: 'hans.schmidt@school.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    address: {
      street: 'Hauptstraße 12',
      city: 'Berlin',
      country: 'Germany'
    },
    joiningDate: '2020-08-15',
    archived: false
  },
  {
    id: '3',
    name: 'Anna Weber',
    email: 'anna.weber@parent.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    address: {
      street: 'Gartenstraße 45',
      city: 'Munich',
      country: 'Germany'
    },
    joiningDate: '2019-09-22',
    archived: true
  },
  {
    id: '4',
    name: 'Thomas Klein',
    email: 'thomas.klein@school.edu',
    role: 'schoolstaff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    address: {
      street: 'Schulstraße 1',
      city: 'Hamburg',
      country: 'Germany'
    },
    joiningDate: '2018-03-10',
    archived: false
  }
]

// Computed properties
const canSearch = computed(() => {
  return searchFilters.value.firstName.trim() !== '' || 
         searchFilters.value.lastName.trim() !== '' ||
         searchFilters.value.selectedRoles.length > 0
})

const canExport = computed(() => {
  return exportOptions.value.password.length >= 6 && 
         selectedUsers.value.length > 0
})

// Methods
const toggleRole = (roleValue: string): void => {
  const index = searchFilters.value.selectedRoles.indexOf(roleValue)
  if (index > -1) {
    searchFilters.value.selectedRoles.splice(index, 1)
  } else {
    searchFilters.value.selectedRoles.push(roleValue)
  }
}

const performSearch = (): void => {
  hasSearched.value = true
  
  // Filter mock users based on search criteria
  let results: User[] = [...mockUsers]
  
  // Filter by name
  if (searchFilters.value.firstName.trim()) {
    results = results.filter(user => 
      user.name.toLowerCase().includes(searchFilters.value.firstName.toLowerCase())
    )
  }
  
  if (searchFilters.value.lastName.trim()) {
    results = results.filter(user => 
      user.name.toLowerCase().includes(searchFilters.value.lastName.toLowerCase())
    )
  }
  
  // Filter by roles
  if (searchFilters.value.selectedRoles.length > 0) {
    results = results.filter(user => 
      searchFilters.value.selectedRoles.includes(user.role)
    )
  }
  
  // Filter by archive
  if (!searchFilters.value.includeArchive) {
    results = results.filter(user => !user.archived)
  }
  
  searchResults.value = results
  selectedUsers.value = []
  selectAll.value = false
}

const toggleUser = (userId: string): void => {
  const index = selectedUsers.value.indexOf(userId)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(userId)
  }
}

const toggleAllUsers = (): void => {
  if (selectAll.value) {
    selectedUsers.value = searchResults.value.map(user => user.id)
  } else {
    selectedUsers.value = []
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US')
}

const getRoleDisplayName = (role: string): string => {
  const roleNames: Record<string, Record<string, string>> = {
    en: {
      student: 'Student',
      teacher: 'Teacher',
      parent: 'Parent',
      schoolstaff: 'School Staff',
      admin: 'Administrator'
    },
    de: {
      student: 'Schüler',
      teacher: 'Lehrer',
      parent: 'Eltern',
      schoolstaff: 'Schulpersonal',
      admin: 'Administrator'
    }
  }
  
  return roleNames[language.value as 'en' | 'de'][role] || role
}

const getRoleColor = (role: string): string => {
  const colors: Record<string, string> = {
    student: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    teacher: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    parent: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    schoolstaff: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    admin: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }
  
  return colors[role] || 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400'
}

const generateReport = (): void => {
  if (!canExport.value) return
  
  const selectedUserData = searchResults.value.filter((user: User) => 
    selectedUsers.value.includes(user.id)
  )
  
  if (exportOptions.value.format === 'pdf') {
    // Simulate PDF generation
    console.log('Generating PDF report for users:', selectedUserData)
    alert(language.value === 'de' ? 
      `PDF-Bericht wird generiert für ${selectedUserData.length} Benutzer mit Passwortschutz.` :
      `Generating PDF report for ${selectedUserData.length} users with password protection.`
    )
  } else {
    // Simulate JSON export
    const jsonData = {
      exportDate: new Date().toISOString(),
      users: selectedUserData,
      passwordProtected: true
    }
    
    console.log('Generating JSON export:', jsonData)
    
    // Download JSON file (simulated)
    const dataStr = JSON.stringify(jsonData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gdpr-report-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }
  
  // Reset and close modal
  showExportModal.value = false
  exportOptions.value.password = ''
  selectedUsers.value = []
  selectAll.value = false
}
</script> 