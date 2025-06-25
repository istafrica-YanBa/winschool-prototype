<template>
  <div class="schools bg-gray-50 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Schulverwaltung' : 'School Management' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie Schulen im System' : 'Manage schools in the system' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showSchoolModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Schule hinzufügen' : 'Add School' }}
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Search and Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="language === 'de' ? 'Schulen suchen...' : 'Search schools...'"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <select 
            v-model="selectedType"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Alle Typen' : 'All Types' }}</option>
            <option v-for="type in schoolTypes" :key="type" :value="type">{{ type }}</option>
          </select>
          <select 
            v-model="selectedStatus"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="Active">{{ language === 'de' ? 'Aktiv' : 'Active' }}</option>
            <option value="Setup">{{ language === 'de' ? 'Einrichtung' : 'Setup' }}</option>
            <option value="Inactive">{{ language === 'de' ? 'Inaktiv' : 'Inactive' }}</option>
          </select>
        </div>
      </div>

      <!-- Schools Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="school in filteredSchools" 
          :key="school.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover"
        >
          <div class="flex items-center mb-4">
            <div class="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-4">
              <Building class="h-6 w-6 text-primary-600" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ school.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ school.type }}</p>
            </div>
            <span :class="getSchoolStatusColor(school.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ school.status }}
            </span>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Standort' : 'Location' }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ school.location }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Administrator' : 'Administrator' }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ school.admin }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Schüler' : 'Students' }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ school.students }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Lehrer' : 'Teachers' }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ school.teachers }}</span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button @click="viewSchool(school)" class="flex-1 px-3 py-2 text-sm bg-primary-100 text-primary-800 rounded-lg hover:bg-primary-200 transition-colors">
              {{ language === 'de' ? 'Details' : 'Details' }}
            </button>
            <button @click="editSchool(school)" class="px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
              <Edit class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Add School Modal -->
      <div v-if="showSchoolModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Neue Schule hinzufügen' : 'Add New School' }}
              </h3>
              <button @click="showSchoolModal = false" class="text-gray-400 hover:text-gray-600">
                <X class="h-6 w-6" />
              </button>
            </div>

            <form @submit.prevent="addSchool" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Schulname' : 'School Name' }}
                </label>
                <input v-model="schoolForm.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Schultyp' : 'School Type' }}
                </label>
                <select v-model="schoolForm.type" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">{{ language === 'de' ? 'Typ wählen' : 'Select Type' }}</option>
                  <option v-for="type in schoolTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Standort' : 'Location' }}
                </label>
                <input v-model="schoolForm.location" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Administrator E-Mail' : 'Administrator Email' }}
                </label>
                <input v-model="schoolForm.adminEmail" type="email" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div class="flex justify-end space-x-3">
                <button type="button" @click="showSchoolModal = false" class="btn-secondary">
                  {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
                </button>
                <button type="submit" class="btn-primary">
                  {{ language === 'de' ? 'Schule hinzufügen' : 'Add School' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Building, Plus, Search, Edit, X } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const showSchoolModal = ref(false)

const schoolForm = ref({
  name: '',
  type: '',
  location: '',
  adminEmail: ''
})

const schoolTypes = ['Gymnasium', 'Realschule', 'Hauptschule', 'Gesamtschule', 'Grundschule']

const schools = ref([
  {
    id: 1,
    name: 'Gymnasium Berlin-Mitte',
    type: 'Gymnasium',
    location: 'Berlin, Germany',
    admin: 'Sarah Fischer',
    students: 1247,
    teachers: 89,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Realschule Hamburg-Nord',
    type: 'Realschule',
    location: 'Hamburg, Germany',
    admin: 'Thomas Weber',
    students: 890,
    teachers: 65,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Gesamtschule München-Süd',
    type: 'Gesamtschule',
    location: 'Munich, Germany',
    admin: 'Michael Wagner',
    students: 1456,
    teachers: 112,
    status: 'Active'
  },
  {
    id: 4,
    name: 'Grundschule Frankfurt-West',
    type: 'Grundschule',
    location: 'Frankfurt, Germany',
    admin: 'Anna Schmidt',
    students: 450,
    teachers: 32,
    status: 'Setup'
  },
  {
    id: 5,
    name: 'Hauptschule Köln-West',
    type: 'Hauptschule',
    location: 'Cologne, Germany',
    admin: 'Peter Müller',
    students: 654,
    teachers: 48,
    status: 'Active'
  },
  {
    id: 6,
    name: 'Gymnasium Dresden-Ost',
    type: 'Gymnasium',
    location: 'Dresden, Germany',
    admin: 'Maria Schneider',
    students: 980,
    teachers: 74,
    status: 'Inactive'
  }
])

const filteredSchools = computed(() => {
  return schools.value.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         school.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !selectedType.value || school.type === selectedType.value
    const matchesStatus = !selectedStatus.value || school.status === selectedStatus.value
    
    return matchesSearch && matchesType && matchesStatus
  })
})

const getSchoolStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Setup':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const viewSchool = (school: any) => {
  alert(`${language.value === 'de' ? 'Schule anzeigen' : 'View school'}: ${school.name}`)
}

const editSchool = (school: any) => {
  alert(`${language.value === 'de' ? 'Schule bearbeiten' : 'Edit school'}: ${school.name}`)
}

const addSchool = () => {
  const newSchool = {
    id: schools.value.length + 1,
    name: schoolForm.value.name,
    type: schoolForm.value.type,
    location: schoolForm.value.location,
    admin: 'New Admin',
    students: 0,
    teachers: 0,
    status: 'Setup'
  }
  
  schools.value.push(newSchool)
  showSchoolModal.value = false
  schoolForm.value = {
    name: '',
    type: '',
    location: '',
    adminEmail: ''
  }
  
  alert(language.value === 'de' ? 'Schule erfolgreich hinzugefügt!' : 'School added successfully!')
}
</script>
