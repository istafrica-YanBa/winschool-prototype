<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Upload class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Medienverwaltung' : 'Media Management' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie digitale und physische Medien wie DVDs und Software' : 'Manage digital and physical media assets like DVDs and software' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showFilters = !showFilters" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Filter class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Filter' : 'Filters' }}
        </button>
        <button @click="showAddMedia = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Medium hinzufügen' : 'Add Media' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in mediaStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
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
            {{ language === 'de' ? 'Medientyp' : 'Media Type' }}
          </label>
          <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Typen' : 'All Types' }}</option>
            <option value="DVD">DVD</option>
            <option value="Software">{{ language === 'de' ? 'Software' : 'Software' }}</option>
            <option value="Digital Resource">{{ language === 'de' ? 'Digitale Ressource' : 'Digital Resource' }}</option>
            <option value="Audio CD">Audio CD</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Verfügbarkeit' : 'Availability' }}
          </label>
          <select v-model="filters.availability" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="Available">{{ language === 'de' ? 'Verfügbar' : 'Available' }}</option>
            <option value="Checked Out">{{ language === 'de' ? 'Ausgeliehen' : 'Checked Out' }}</option>
            <option value="Maintenance">{{ language === 'de' ? 'Wartung' : 'Maintenance' }}</option>
            <option value="Lost">{{ language === 'de' ? 'Verloren' : 'Lost' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Jahr' : 'Year' }}
          </label>
          <select v-model="filters.year" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Jahre' : 'All Years' }}</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
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
          :placeholder="language === 'de' ? 'Medien suchen...' : 'Search media...'"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Media Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Mediensammlung' : 'Media Collection' }}
        </h2>
        
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Titel' : 'Title' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Typ' : 'Type' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Jahr' : 'Year' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Lizenz' : 'License' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Status' : 'Availability' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Aktionen' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="media in filteredMedia" :key="media.id" class="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ media.title }}</div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getTypeColor(media.type)">
                    {{ language === 'de' ? getTypeTranslation(media.type) : media.type }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">{{ media.year }}</td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">{{ media.licenseInfo }}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getAvailabilityColor(media.availability)">
                    {{ language === 'de' ? getAvailabilityTranslation(media.availability) : media.availability }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="editMedia(media)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="checkOut(media)" class="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" v-if="media.availability === 'Available'">
                      <CheckCircle class="h-4 w-4" />
                    </button>
                    <button @click="deleteMedia(media.id)" class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
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
          <div v-for="media in filteredMedia" :key="media.id" class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-medium text-slate-800 dark:text-slate-200">{{ media.title }}</h3>
              <div class="flex space-x-2">
                <button @click="editMedia(media)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <Edit class="h-4 w-4" />
                </button>
                <button @click="checkOut(media)" class="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" v-if="media.availability === 'Available'">
                  <CheckCircle class="h-4 w-4" />
                </button>
                <button @click="deleteMedia(media.id)" class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Typ:' : 'Type:' }}</span>
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getTypeColor(media.type)">
                  {{ language === 'de' ? getTypeTranslation(media.type) : media.type }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Jahr:' : 'Year:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ media.year }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Lizenz:' : 'License:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ media.licenseInfo }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Status:' : 'Availability:' }}</span>
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getAvailabilityColor(media.availability)">
                  {{ language === 'de' ? getAvailabilityTranslation(media.availability) : media.availability }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Media Modal -->
    <div v-if="showAddMedia || editingMedia" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">
          {{ editingMedia ? (language === 'de' ? 'Medium bearbeiten' : 'Edit Media') : (language === 'de' ? 'Medium hinzufügen' : 'Add Media') }}
        </h3>
        <form @submit.prevent="saveMedia" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Titel' : 'Title' }}
            </label>
            <input
              v-model="mediaForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Medientyp' : 'Media Type' }}
            </label>
            <select
              v-model="mediaForm.type"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="">{{ language === 'de' ? 'Typ auswählen' : 'Select Type' }}</option>
              <option value="DVD">DVD</option>
              <option value="Software">{{ language === 'de' ? 'Software' : 'Software' }}</option>
              <option value="Digital Resource">{{ language === 'de' ? 'Digitale Ressource' : 'Digital Resource' }}</option>
              <option value="Audio CD">Audio CD</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Jahr' : 'Year' }}
            </label>
            <input
              v-model.number="mediaForm.year"
              type="number"
              min="1900"
              max="2030"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Lizenzinformationen' : 'License Information' }}
            </label>
            <input
              v-model="mediaForm.licenseInfo"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Verfügbarkeit' : 'Availability' }}
            </label>
            <select
              v-model="mediaForm.availability"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="">{{ language === 'de' ? 'Status auswählen' : 'Select Status' }}</option>
              <option value="Available">{{ language === 'de' ? 'Verfügbar' : 'Available' }}</option>
              <option value="Checked Out">{{ language === 'de' ? 'Ausgeliehen' : 'Checked Out' }}</option>
              <option value="Maintenance">{{ language === 'de' ? 'Wartung' : 'Maintenance' }}</option>
              <option value="Lost">{{ language === 'de' ? 'Verloren' : 'Lost' }}</option>
            </select>
          </div>
          <div class="flex space-x-3">
            <button
              type="submit"
              class="flex-1 bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {{ editingMedia ? (language === 'de' ? 'Aktualisieren' : 'Update') : (language === 'de' ? 'Hinzufügen' : 'Add') }}
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
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { 
  Upload, Plus, Filter, Search, Edit, Trash2,
  CheckCircle, Disc, Monitor
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const showFilters = ref(false)
const showAddMedia = ref(false)
const editingMedia = ref<any>(null)
const searchQuery = ref('')

// Filters
const filters = ref({
  type: '',
  availability: '',
  year: ''
})

// Form data
const mediaForm = ref({
  title: '',
  type: '',
  year: new Date().getFullYear(),
  licenseInfo: '',
  availability: 'Available'
})

// Mock data
const mediaItems = ref([
  {
    id: 1,
    title: 'Microsoft Office 365',
    type: 'Software',
    year: 2024,
    licenseInfo: 'Site License - 50 users',
    availability: 'Available'
  },
  {
    id: 2,
    title: 'Educational Chemistry DVD Set',
    type: 'DVD',
    year: 2023,
    licenseInfo: 'Educational Use Only',
    availability: 'Checked Out'
  },
  {
    id: 3,
    title: 'Khan Academy Science Course',
    type: 'Digital Resource',
    year: 2024,
    licenseInfo: 'Unlimited Educational Access',
    availability: 'Available'
  },
  {
    id: 4,
    title: 'Classical Music Collection',
    type: 'Audio CD',
    year: 2022,
    licenseInfo: 'Public Performance Rights',
    availability: 'Available'
  }
])

// Stats
const mediaStats = computed(() => [
  {
    title: language.value === 'de' ? 'Gesamtmedien' : 'Total Media',
    value: mediaItems.value.length.toString(),
    change: '+5 this month',
    changeColor: 'text-green-500',
    icon: Upload,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Verfügbar' : 'Available',
    value: mediaItems.value.filter(m => m.availability === 'Available').length.toString(),
    change: '85% availability rate',
    changeColor: 'text-green-500',
    icon: CheckCircle,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Software-Lizenzen' : 'Software Licenses',
    value: mediaItems.value.filter(m => m.type === 'Software').length.toString(),
    change: '3 expiring soon',
    changeColor: 'text-yellow-500',
    icon: Monitor,
    iconBg: 'bg-purple-600'
  },
  {
    title: language.value === 'de' ? 'Physische Medien' : 'Physical Media',
    value: mediaItems.value.filter(m => m.type === 'DVD' || m.type === 'Audio CD').length.toString(),
    change: 'In good condition',
    changeColor: 'text-blue-500',
    icon: Disc,
    iconBg: 'bg-yellow-600'
  }
])

// Computed
const filteredMedia = computed(() => {
  return mediaItems.value.filter(media => {
    const matchesSearch = media.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         media.type.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         media.licenseInfo.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesType = !filters.value.type || media.type === filters.value.type
    const matchesAvailability = !filters.value.availability || media.availability === filters.value.availability
    const matchesYear = !filters.value.year || media.year.toString() === filters.value.year
    
    return matchesSearch && matchesType && matchesAvailability && matchesYear
  })
})

// Methods
const getTypeColor = (type: string) => {
  const colors = {
    'DVD': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Software': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'Digital Resource': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Audio CD': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const getAvailabilityColor = (availability: string) => {
  const colors = {
    'Available': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Checked Out': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Maintenance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'Lost': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }
  return colors[availability as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const getTypeTranslation = (type: string) => {
  const translations = {
    'DVD': 'DVD',
    'Software': 'Software',
    'Digital Resource': 'Digitale Ressource',
    'Audio CD': 'Audio CD'
  }
  return translations[type as keyof typeof translations] || type
}

const getAvailabilityTranslation = (availability: string) => {
  const translations = {
    'Available': 'Verfügbar',
    'Checked Out': 'Ausgeliehen',
    'Maintenance': 'Wartung',
    'Lost': 'Verloren'
  }
  return translations[availability as keyof typeof translations] || availability
}

const editMedia = (media: any) => {
  editingMedia.value = media
  mediaForm.value = { ...media }
  showAddMedia.value = true
}

const deleteMedia = (id: number) => {
  if (confirm(language.value === 'de' ? 'Medium wirklich löschen?' : 'Are you sure you want to delete this media?')) {
    mediaItems.value = mediaItems.value.filter(media => media.id !== id)
  }
}

const checkOut = (media: any) => {
  media.availability = 'Checked Out'
}

const saveMedia = () => {
  if (editingMedia.value) {
    // Update existing media
    const index = mediaItems.value.findIndex(media => media.id === editingMedia.value.id)
    if (index !== -1) {
      mediaItems.value[index] = { ...mediaForm.value, id: editingMedia.value.id }
    }
  } else {
    // Add new media
    const newMedia = {
      ...mediaForm.value,
      id: Math.max(...mediaItems.value.map(media => media.id)) + 1
    }
    mediaItems.value.push(newMedia)
  }
  cancelEdit()
}

const cancelEdit = () => {
  showAddMedia.value = false
  editingMedia.value = null
  mediaForm.value = {
    title: '',
    type: '',
    year: new Date().getFullYear(),
    licenseInfo: '',
    availability: 'Available'
  }
}
</script> 