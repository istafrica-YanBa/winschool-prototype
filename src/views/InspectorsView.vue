<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Inspektorenverwaltung' : 'Inspector Management' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Verwalten Sie Bildungsinspektoren im System' : 'Manage educational inspectors in the system' }}
        </p>
      </div>
      <button @click="showInspectorModal = true" class="btn-primary flex items-center">
        <Plus class="h-4 w-4 mr-2" />
        {{ language === 'de' ? 'Inspektor hinzufügen' : 'Add Inspector' }}
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="language === 'de' ? 'Inspektoren suchen...' : 'Search inspectors...'"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <select 
          v-model="selectedRegion"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{{ language === 'de' ? 'Alle Regionen' : 'All Regions' }}</option>
          <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
        </select>
      </div>
    </div>

    <!-- Inspectors Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'E-Mail' : 'Email' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Region' : 'Region' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Zugewiesene Schulen' : 'Assigned Schools' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inspector in filteredInspectors" :key="inspector.id" class="border-b border-gray-100 dark:border-gray-700">
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img :src="inspector.avatar" :alt="inspector.name" class="h-8 w-8 rounded-full object-cover mr-3" />
                  <span class="font-medium text-gray-900 dark:text-white">{{ inspector.name }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ inspector.email }}</td>
              <td class="py-3 px-4 text-gray-900 dark:text-white">{{ inspector.region }}</td>
              <td class="py-3 px-4 text-gray-900 dark:text-white">{{ inspector.assignedSchools }}</td>
              <td class="py-3 px-4">
                <span :class="getStatusColor(inspector.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ inspector.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="viewInspector(inspector)" class="text-primary-600 hover:text-primary-800">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="editInspector(inspector)" class="text-secondary-600 hover:text-secondary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="assignSchools(inspector)" class="text-blue-600 hover:text-blue-800">
                    <Building class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Inspector Modal -->
    <div v-if="showInspectorModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neuen Inspektor hinzufügen' : 'Add New Inspector' }}
            </h3>
            <button @click="showInspectorModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="addInspector" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Vorname' : 'First Name' }}
                </label>
                <input v-model="inspectorForm.firstName" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Nachname' : 'Last Name' }}
                </label>
                <input v-model="inspectorForm.lastName" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'E-Mail' : 'Email' }}
              </label>
              <input v-model="inspectorForm.email" type="email" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Region' : 'Region' }}
              </label>
              <select v-model="inspectorForm.region" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">{{ language === 'de' ? 'Region wählen' : 'Select Region' }}</option>
                <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showInspectorModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Inspektor hinzufügen' : 'Add Inspector' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Plus, Search, Eye, Edit, Building, X } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const searchQuery = ref('')
const selectedRegion = ref('')
const showInspectorModal = ref(false)

const inspectorForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  region: ''
})

const regions = ['Berlin', 'Hamburg', 'Munich', 'Frankfurt', 'Cologne', 'Dresden']

const inspectors = ref([
  {
    id: 1,
    name: 'Dr. Elisabeth Bauer',
    email: 'elisabeth.bauer@inspector.winschool.de',
    region: 'Berlin',
    assignedSchools: 8,
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 2,
    name: 'Prof. Markus Hoffmann',
    email: 'markus.hoffmann@inspector.winschool.de',
    region: 'Hamburg',
    assignedSchools: 6,
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 3,
    name: 'Dr. Julia Schneider',
    email: 'julia.schneider@inspector.winschool.de',
    region: 'Munich',
    assignedSchools: 10,
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 4,
    name: 'Dr. Robert Wagner',
    email: 'robert.wagner@inspector.winschool.de',
    region: 'Frankfurt',
    assignedSchools: 5,
    status: 'Inactive',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
])

const filteredInspectors = computed(() => {
  return inspectors.value.filter(inspector => {
    const matchesSearch = inspector.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         inspector.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRegion = !selectedRegion.value || inspector.region === selectedRegion.value
    
    return matchesSearch && matchesRegion
  })
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const viewInspector = (inspector: any) => {
  alert(`${language.value === 'de' ? 'Inspektor anzeigen' : 'View inspector'}: ${inspector.name}`)
}

const editInspector = (inspector: any) => {
  alert(`${language.value === 'de' ? 'Inspektor bearbeiten' : 'Edit inspector'}: ${inspector.name}`)
}

const assignSchools = (inspector: any) => {
  alert(`${language.value === 'de' ? 'Schulen zuweisen für' : 'Assign schools for'}: ${inspector.name}`)
}

const addInspector = () => {
  const newInspector = {
    id: inspectors.value.length + 1,
    name: `${inspectorForm.value.firstName} ${inspectorForm.value.lastName}`,
    email: inspectorForm.value.email,
    region: inspectorForm.value.region,
    assignedSchools: 0,
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
  
  inspectors.value.push(newInspector)
  showInspectorModal.value = false
  inspectorForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    region: ''
  }
  
  alert(language.value === 'de' ? 'Inspektor erfolgreich hinzugefügt!' : 'Inspector added successfully!')
}
</script>
