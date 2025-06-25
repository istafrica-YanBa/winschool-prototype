<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Package class="h-5 w-5 sm:h-7 sm:w-7 image.pngtext-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Bestandsverwaltung' : 'Inventory Management' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie physische Gegenstände wie Laborausrüstung und Büromaterial' : 'Manage physical items like lab equipment and stationery' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showFilters = !showFilters" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Filter class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Filter' : 'Filters' }}
        </button>
        <button @click="showAddItem = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Artikel hinzufügen' : 'Add Item' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in inventoryStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center">
          <div :class="stat.iconBg" class="p-2 sm:p-3 rounded-lg mb-2 sm:mb-0 sm:mr-4 self-start sm:self-auto">
            <component :is="stat.icon" class="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{{ stat.title }}</p>
            <p class="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-50">{{ stat.value }}</p>
            <p :class="stat.changeColor" class="text-xs sm:text-sm truncate">{{ stat.change }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">
        {{ language === 'de' ? 'Filter' : 'Filters' }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Typ' : 'Type' }}
          </label>
          <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Typen' : 'All Types' }}</option>
            <option value="Lab Equipment">{{ language === 'de' ? 'Laborausrüstung' : 'Lab Equipment' }}</option>
            <option value="Stationery">{{ language === 'de' ? 'Büromaterial' : 'Stationery' }}</option>
            <option value="Technology">{{ language === 'de' ? 'Technologie' : 'Technology' }}</option>
            <option value="Furniture">{{ language === 'de' ? 'Möbel' : 'Furniture' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Zustand' : 'Condition' }}
          </label>
          <select v-model="filters.condition" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Zustände' : 'All Conditions' }}</option>
            <option value="New">{{ language === 'de' ? 'Neu' : 'New' }}</option>
            <option value="Good">{{ language === 'de' ? 'Gut' : 'Good' }}</option>
            <option value="Fair">{{ language === 'de' ? 'Angemessen' : 'Fair' }}</option>
            <option value="Poor">{{ language === 'de' ? 'Schlecht' : 'Poor' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Ort' : 'Location' }}
          </label>
          <select v-model="filters.location" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Orte' : 'All Locations' }}</option>
            <option value="Lab 1">Lab 1</option>
            <option value="Lab 2">Lab 2</option>
            <option value="Office">{{ language === 'de' ? 'Büro' : 'Office' }}</option>
            <option value="Storage">{{ language === 'de' ? 'Lager' : 'Storage' }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="language === 'de' ? 'Artikel suchen...' : 'Search items...'"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Bestandsartikel' : 'Inventory Items' }}
        </h2>
        
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Name' : 'Name' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Typ' : 'Type' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Zustand' : 'Condition' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Menge' : 'Quantity' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Ort' : 'Location' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Aktionen' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id" class="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ item.name }}</div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getTypeColor(item.type)">
                    {{ language === 'de' ? getTypeTranslation(item.type) : item.type }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getConditionColor(item.condition)">
                    {{ language === 'de' ? getConditionTranslation(item.condition) : item.condition }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">{{ item.quantity }}</td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">{{ item.location }}</td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="editItem(item)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="deleteItem(item.id)" class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4">
          <div v-for="item in filteredItems" :key="item.id" class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-medium text-slate-800 dark:text-slate-200">{{ item.name }}</h3>
              <div class="flex space-x-2">
                <button @click="editItem(item)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <Edit class="h-4 w-4" />
                </button>
                <button @click="deleteItem(item.id)" class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Typ:' : 'Type:' }}</span>
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getTypeColor(item.type)">
                  {{ language === 'de' ? getTypeTranslation(item.type) : item.type }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Zustand:' : 'Condition:' }}</span>
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getConditionColor(item.condition)">
                  {{ language === 'de' ? getConditionTranslation(item.condition) : item.condition }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Menge:' : 'Quantity:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ item.quantity }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Ort:' : 'Location:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ item.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Item Modal -->
    <div v-if="showAddItem || editingItem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">
          {{ editingItem ? (language === 'de' ? 'Artikel bearbeiten' : 'Edit Item') : (language === 'de' ? 'Artikel hinzufügen' : 'Add Item') }}
        </h3>
        <form @submit.prevent="saveItem" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Name' : 'Name' }}
            </label>
            <input
              v-model="itemForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Typ' : 'Type' }}
            </label>
            <select
              v-model="itemForm.type"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="">{{ language === 'de' ? 'Typ auswählen' : 'Select Type' }}</option>
              <option value="Lab Equipment">{{ language === 'de' ? 'Laborausrüstung' : 'Lab Equipment' }}</option>
              <option value="Stationery">{{ language === 'de' ? 'Büromaterial' : 'Stationery' }}</option>
              <option value="Technology">{{ language === 'de' ? 'Technologie' : 'Technology' }}</option>
              <option value="Furniture">{{ language === 'de' ? 'Möbel' : 'Furniture' }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Zustand' : 'Condition' }}
            </label>
            <select
              v-model="itemForm.condition"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="">{{ language === 'de' ? 'Zustand auswählen' : 'Select Condition' }}</option>
              <option value="New">{{ language === 'de' ? 'Neu' : 'New' }}</option>
              <option value="Good">{{ language === 'de' ? 'Gut' : 'Good' }}</option>
              <option value="Fair">{{ language === 'de' ? 'Angemessen' : 'Fair' }}</option>
              <option value="Poor">{{ language === 'de' ? 'Schlecht' : 'Poor' }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Menge' : 'Quantity' }}
            </label>
            <input
              v-model.number="itemForm.quantity"
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Ort' : 'Location' }}
            </label>
            <input
              v-model="itemForm.location"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Notizen' : 'Notes' }}
            </label>
            <textarea
              v-model="itemForm.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            ></textarea>
          </div>
          <div class="flex space-x-3">
            <button
              type="submit"
              class="flex-1 bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {{ editingItem ? (language === 'de' ? 'Aktualisieren' : 'Update') : (language === 'de' ? 'Hinzufügen' : 'Add') }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="flex-1 bg-slate-500 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { useAuthStore } from '../../stores/auth'
import { 
  Package, Plus, Filter, Search, Edit, Trash2, ChevronRight,
  TrendingUp, AlertTriangle, CheckCircle, Clock
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const language = computed(() => themeStore.language)
const userRole = computed(() => authStore.user?.role)

// State
const showFilters = ref(false)
const showAddItem = ref(false)
const editingItem = ref<any>(null)
const searchQuery = ref('')

// Filters
const filters = ref({
  type: '',
  condition: '',
  location: ''
})

// Form data
const itemForm = ref({
  name: '',
  type: '',
  condition: '',
  quantity: 0,
  location: '',
  notes: ''
})

// Mock data
const inventoryItems = ref([
  {
    id: 1,
    name: 'Microscope Set',
    type: 'Lab Equipment',
    condition: 'Good',
    quantity: 5,
    location: 'Lab 1',
    notes: 'Regular maintenance required'
  },
  {
    id: 2,
    name: 'Printer Paper A4',
    type: 'Stationery',
    condition: 'New',
    quantity: 50,
    location: 'Office',
    notes: 'Bulk purchase for Q1'
  },
  {
    id: 3,
    name: 'Laptop Lenovo ThinkPad',
    type: 'Technology',
    condition: 'Fair',
    quantity: 8,
    location: 'Storage',
    notes: 'Some units need battery replacement'
  },
  {
    id: 4,
    name: 'Desk Chairs',
    type: 'Furniture',
    condition: 'Good',
    quantity: 15,
    location: 'Storage',
    notes: 'Ergonomic design'
  }
])

// Stats
const inventoryStats = computed(() => [
  {
    title: language.value === 'de' ? 'Gesamtartikel' : 'Total Items',
    value: inventoryItems.value.length.toString(),
    change: '+12 this month',
    changeColor: 'text-green-500',
    icon: Package,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Niedriger Bestand' : 'Low Stock',
    value: '3',
    change: 'Alert threshold: <5',
    changeColor: 'text-red-500',
    icon: AlertTriangle,
    iconBg: 'bg-red-600'
  },
  {
    title: language.value === 'de' ? 'Gesamtwert' : 'Total Value',
    value: '€45,280',
    change: '+8.5% from last month',
    changeColor: 'text-green-500',
    icon: TrendingUp,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Letzte Aktualisierung' : 'Last Updated',
    value: '2 hrs ago',
    change: 'Real-time tracking',
    changeColor: 'text-blue-500',
    icon: Clock,
    iconBg: 'bg-yellow-600'
  }
])

// Computed
const filteredItems = computed(() => {
  return inventoryItems.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesType = !filters.value.type || item.type === filters.value.type
    const matchesCondition = !filters.value.condition || item.condition === filters.value.condition
    const matchesLocation = !filters.value.location || item.location === filters.value.location
    
    return matchesSearch && matchesType && matchesCondition && matchesLocation
  })
})

// Methods
const getTypeColor = (type: string) => {
  const colors = {
    'Lab Equipment': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'Stationery': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Technology': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Furniture': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const getConditionColor = (condition: string) => {
  const colors = {
    'New': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Good': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Fair': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'Poor': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }
  return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const getTypeTranslation = (type: string) => {
  const translations = {
    'Lab Equipment': 'Laborausrüstung',
    'Stationery': 'Büromaterial',
    'Technology': 'Technologie',
    'Furniture': 'Möbel'
  }
  return translations[type as keyof typeof translations] || type
}

const getConditionTranslation = (condition: string) => {
  const translations = {
    'New': 'Neu',
    'Good': 'Gut',
    'Fair': 'Angemessen',
    'Poor': 'Schlecht'
  }
  return translations[condition as keyof typeof translations] || condition
}

const editItem = (item: any) => {
  editingItem.value = item
  itemForm.value = { ...item }
  showAddItem.value = true
}

const deleteItem = (id: number) => {
  if (confirm(language.value === 'de' ? 'Artikel wirklich löschen?' : 'Are you sure you want to delete this item?')) {
    inventoryItems.value = inventoryItems.value.filter(item => item.id !== id)
  }
}

const saveItem = () => {
  if (editingItem.value) {
    // Update existing item
    const index = inventoryItems.value.findIndex(item => item.id === editingItem.value.id)
    if (index !== -1) {
      inventoryItems.value[index] = { ...itemForm.value, id: editingItem.value.id }
    }
  } else {
    // Add new item
    const newItem = {
      ...itemForm.value,
      id: Math.max(...inventoryItems.value.map(item => item.id)) + 1
    }
    inventoryItems.value.push(newItem)
  }
  cancelEdit()
}

const cancelEdit = () => {
  showAddItem.value = false
  editingItem.value = null
  itemForm.value = {
    name: '',
    type: '',
    condition: '',
    quantity: 0,
    location: '',
    notes: ''
  }
}

onMounted(() => {
  // Initialize component
})
</script> 