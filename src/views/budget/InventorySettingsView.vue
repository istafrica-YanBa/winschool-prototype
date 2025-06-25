<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Settings class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Bestandseinstellungen' : 'Inventory Settings' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Konfigurieren Sie Richtlinien, Kategorien und Schwellenwerte' : 'Configure policies, categories, and thresholds' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="exportSettings" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Download class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Exportieren' : 'Export' }}
        </button>
        <button @click="resetToDefaults" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <RotateCcw class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Zurücksetzen' : 'Reset' }}
        </button>
        <button @click="saveAllSettings" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Save class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Alle speichern' : 'Save All' }}
        </button>
      </div>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-6">
      <div class="border-b border-gray-200 dark:border-slate-600">
        <nav class="flex space-x-8 px-6" aria-label="Tabs">
          <button
            v-for="tab in settingTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            <component :is="tab.icon" class="h-5 w-5 mr-2 inline" />
            {{ language === 'de' ? tab.labelDe : tab.label }}
          </button>
        </nav>
      </div>

      <!-- General Settings Tab -->
      <div v-if="activeTab === 'general'" class="p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Allgemeine Einstellungen' : 'General Settings' }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Standard-Ausleihzeit (Tage)' : 'Default Loan Period (Days)' }}
              </label>
              <input
                v-model.number="generalSettings.defaultLoanPeriod"
                type="number"
                min="1"
                max="365"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Maximale Verlängerungen' : 'Maximum Renewals' }}
              </label>
              <input
                v-model.number="generalSettings.maxRenewals"
                type="number"
                min="0"
                max="10"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Verspätungsgebühr pro Tag (€)' : 'Late Fee Per Day (€)' }}
              </label>
              <input
                v-model.number="generalSettings.lateFeePerDay"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Mindestbestand' : 'Minimum Stock Level' }}
              </label>
              <input
                v-model.number="generalSettings.minStockLevel"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Automatische E-Mail-Erinnerungen' : 'Automatic Email Reminders' }}
              </label>
              <select v-model="generalSettings.emailReminders" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="disabled">{{ language === 'de' ? 'Deaktiviert' : 'Disabled' }}</option>
                <option value="daily">{{ language === 'de' ? 'Täglich' : 'Daily' }}</option>
                <option value="weekly">{{ language === 'de' ? 'Wöchentlich' : 'Weekly' }}</option>
              </select>
            </div>
            
            <div class="flex items-center">
              <input
                v-model="generalSettings.requireSignature"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label class="ml-2 text-sm text-slate-700 dark:text-slate-300">
                {{ language === 'de' ? 'Unterschrift bei Ausleihe erforderlich' : 'Require signature for checkout' }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Tab -->
      <div v-if="activeTab === 'categories'" class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Kategorien verwalten' : 'Manage Categories' }}
          </h3>
          <button @click="showAddCategory = true" class="bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Kategorie hinzufügen' : 'Add Category' }}
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="category in categories" :key="category.id" class="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ category.name }}</h4>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ category.description }}</p>
              </div>
              <div class="flex space-x-1">
                <button @click="editCategory(category)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <Edit class="h-4 w-4" />
                </button>
                <button @click="deleteCategory(category.id)" class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500 dark:text-slate-400">{{ category.itemCount }} {{ language === 'de' ? 'Artikel' : 'items' }}</span>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="category.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'">
                {{ category.active ? (language === 'de' ? 'Aktiv' : 'Active') : (language === 'de' ? 'Inaktiv' : 'Inactive') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Thresholds Tab -->
      <div v-if="activeTab === 'thresholds'" class="p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Schwellenwerte und Benachrichtigungen' : 'Thresholds and Notifications' }}
        </h3>
        
        <div class="space-y-6">
          <div class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <h4 class="font-medium text-slate-800 dark:text-slate-200 mb-4">
              {{ language === 'de' ? 'Bestandschwellenwerte' : 'Stock Thresholds' }}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Kritischer Bestand' : 'Critical Stock' }}
                </label>
                <input
                  v-model.number="thresholds.criticalStock"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Niedriger Bestand' : 'Low Stock' }}
                </label>
                <input
                  v-model.number="thresholds.lowStock"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Überbestand' : 'Overstock' }}
                </label>
                <input
                  v-model.number="thresholds.overstock"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <h4 class="font-medium text-slate-800 dark:text-slate-200 mb-4">
              {{ language === 'de' ? 'Gebührenschwellenwerte' : 'Fee Thresholds' }}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Maximale Verspätungsgebühr (€)' : 'Maximum Late Fee (€)' }}
                </label>
                <input
                  v-model.number="thresholds.maxLateFee"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Ausstehende Gebühren Grenzwert (€)' : 'Outstanding Fees Limit (€)' }}
                </label>
                <input
                  v-model.number="thresholds.outstandingFeesLimit"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <h4 class="font-medium text-slate-800 dark:text-slate-200 mb-4">
              {{ language === 'de' ? 'Benachrichtigungseinstellungen' : 'Notification Settings' }}
            </h4>
            <div class="space-y-3">
              <div class="flex items-center">
                <input
                  v-model="notifications.stockAlerts"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label class="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  {{ language === 'de' ? 'Bestandsbenachrichtigungen' : 'Stock alerts' }}
                </label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="notifications.overdueReminders"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label class="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  {{ language === 'de' ? 'Überfällige Erinnerungen' : 'Overdue reminders' }}
                </label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="notifications.damageReports"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label class="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  {{ language === 'de' ? 'Schadensmeldungen' : 'Damage reports' }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Policies Tab -->
      <div v-if="activeTab === 'policies'" class="p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Richtlinien und Regeln' : 'Policies and Rules' }}
        </h3>
        
        <div class="space-y-6">
          <div class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <h4 class="font-medium text-slate-800 dark:text-slate-200 mb-4">
              {{ language === 'de' ? 'Ausleihrichtlinien' : 'Lending Policies' }}
            </h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-700 dark:text-slate-300">
                  {{ language === 'de' ? 'Mehrfachausleihe erlauben' : 'Allow multiple checkouts' }}
                </span>
                <input
                  v-model="policies.allowMultipleCheckouts"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-700 dark:text-slate-300">
                  {{ language === 'de' ? 'Reservierungen erlauben' : 'Allow reservations' }}
                </span>
                <input
                  v-model="policies.allowReservations"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-700 dark:text-slate-300">
                  {{ language === 'de' ? 'Ausleihe bei ausstehenden Gebühren blockieren' : 'Block checkout with outstanding fees' }}
                </span>
                <input
                  v-model="policies.blockWithOutstandingFees"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <h4 class="font-medium text-slate-800 dark:text-slate-200 mb-4">
              {{ language === 'de' ? 'Benutzerrichtlinien' : 'User Policies' }}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Max. Artikel pro Schüler' : 'Max items per student' }}
                </label>
                <input
                  v-model.number="policies.maxItemsPerStudent"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Max. Artikel pro Lehrer' : 'Max items per teacher' }}
                </label>
                <input
                  v-model.number="policies.maxItemsPerTeacher"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div v-if="showAddCategory || editingCategory" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ editingCategory ? (language === 'de' ? 'Kategorie bearbeiten' : 'Edit Category') : (language === 'de' ? 'Kategorie hinzufügen' : 'Add Category') }}
            </h3>
            <button @click="closeCategoryModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <form @submit.prevent="submitCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </label>
              <input
                v-model="currentCategory.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea
                v-model="currentCategory.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              ></textarea>
            </div>
            
            <div class="flex items-center">
              <input
                v-model="currentCategory.active"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label class="ml-2 text-sm text-slate-700 dark:text-slate-300">
                {{ language === 'de' ? 'Aktiv' : 'Active' }}
              </label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeCategoryModal"
                class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-medium rounded-lg"
              >
                {{ editingCategory ? (language === 'de' ? 'Aktualisieren' : 'Update') : (language === 'de' ? 'Hinzufügen' : 'Add') }}
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
import { useLanguageStore } from '@/stores/language'
import {
  Settings,
  ChevronRight,
  Save,
  Plus,
  Edit,
  Trash2,
  X,
  Wrench,
  Tag,
  TrendingUp,
  Shield,
  Download,
  RotateCcw
} from 'lucide-vue-next'

const languageStore = useLanguageStore()
const language = computed(() => languageStore.language)

// Reactive data
const activeTab = ref('general')
const showAddCategory = ref(false)
const editingCategory = ref(null)

const settingTabs = [
  { id: 'general', label: 'General', labelDe: 'Allgemein', icon: Wrench },
  { id: 'categories', label: 'Categories', labelDe: 'Kategorien', icon: Tag },
  { id: 'thresholds', label: 'Thresholds', labelDe: 'Schwellenwerte', icon: TrendingUp },
  { id: 'policies', label: 'Policies', labelDe: 'Richtlinien', icon: Shield }
]

const generalSettings = ref({
  defaultLoanPeriod: 14,
  maxRenewals: 2,
  lateFeePerDay: 0.50,
  minStockLevel: 5,
  emailReminders: 'weekly',
  requireSignature: true
})

const thresholds = ref({
  criticalStock: 2,
  lowStock: 5,
  overstock: 100,
  maxLateFee: 50.00,
  outstandingFeesLimit: 25.00
})

const notifications = ref({
  stockAlerts: true,
  overdueReminders: true,
  damageReports: true
})

const policies = ref({
  allowMultipleCheckouts: true,
  allowReservations: true,
  blockWithOutstandingFees: true,
  maxItemsPerStudent: 3,
  maxItemsPerTeacher: 10
})

const categories = ref([
  {
    id: 1,
    name: 'Lab Equipment',
    description: 'Scientific laboratory equipment and tools',
    active: true,
    itemCount: 45
  },
  {
    id: 2,
    name: 'Books',
    description: 'Textbooks and reference materials',
    active: true,
    itemCount: 1250
  },
  {
    id: 3,
    name: 'Technology',
    description: 'Computers, tablets, and electronic devices',
    active: true,
    itemCount: 78
  },
  {
    id: 4,
    name: 'Sports Equipment',
    description: 'Athletic and recreational equipment',
    active: false,
    itemCount: 23
  }
])

const currentCategory = ref({
  name: '',
  description: '',
  active: true
})

// Methods
const saveAllSettings = () => {
  // In a real app, this would save all settings to the backend
  console.log('Saving settings:', {
    general: generalSettings.value,
    thresholds: thresholds.value,
    notifications: notifications.value,
    policies: policies.value,
    categories: categories.value
  })
  
  // Show success message or toast
  alert(language.value === 'de' ? 'Einstellungen gespeichert!' : 'Settings saved!')
}

const editCategory = (category: any) => {
  editingCategory.value = category
  currentCategory.value = { ...category }
  showAddCategory.value = true
}

const deleteCategory = (categoryId: number) => {
  if (confirm(language.value === 'de' ? 'Kategorie löschen?' : 'Delete category?')) {
    categories.value = categories.value.filter(c => c.id !== categoryId)
  }
}

const closeCategoryModal = () => {
  showAddCategory.value = false
  editingCategory.value = null
  currentCategory.value = {
    name: '',
    description: '',
    active: true
  }
}

const submitCategory = () => {
  if (editingCategory.value) {
    // Update existing category
    const index = categories.value.findIndex(c => c.id === editingCategory.value.id)
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index],
        ...currentCategory.value
      }
    }
  } else {
    // Add new category
    const newCategory = {
      id: Date.now(),
      ...currentCategory.value,
      itemCount: 0
    }
    categories.value.push(newCategory)
  }
  
  closeCategoryModal()
}
</script> 