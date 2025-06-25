<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Package class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Bestellverwaltung' : 'Orders Management' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Bestellungen mit Lieferantenverfolgung verwalten' : 'Manage purchase orders with vendor tracking' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showFilters = !showFilters" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Filter class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Filter' : 'Filters' }}
        </button>
        <button @click="showVendors = !showVendors" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Building class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Lieferanten' : 'Vendors' }}
        </button>
        <button @click="showNewOrder = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Neue Bestellung' : 'New Order' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in orderStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Status' : 'Status' }}
          </label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="pending">{{ language === 'de' ? 'Ausstehend' : 'Pending' }}</option>
            <option value="approved">{{ language === 'de' ? 'Genehmigt' : 'Approved' }}</option>
            <option value="ordered">{{ language === 'de' ? 'Bestellt' : 'Ordered' }}</option>
            <option value="delivered">{{ language === 'de' ? 'Geliefert' : 'Delivered' }}</option>
            <option value="cancelled">{{ language === 'de' ? 'Storniert' : 'Cancelled' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Lieferant' : 'Vendor' }}
          </label>
          <select v-model="filters.vendor" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Lieferanten' : 'All Vendors' }}</option>
            <option v-for="vendor in vendors" :key="vendor.id" :value="vendor.id">{{ vendor.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Kategorie' : 'Category' }}
          </label>
          <select v-model="filters.category" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Kategorien' : 'All Categories' }}</option>
            <option value="books">{{ language === 'de' ? 'Bücher' : 'Books' }}</option>
            <option value="equipment">{{ language === 'de' ? 'Ausrüstung' : 'Equipment' }}</option>
            <option value="supplies">{{ language === 'de' ? 'Verbrauchsmaterial' : 'Supplies' }}</option>
            <option value="technology">{{ language === 'de' ? 'Technologie' : 'Technology' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Suchbegriff' : 'Search' }}
          </label>
          <input v-model="filters.search" type="text" :placeholder="language === 'de' ? 'Nach Bestellnummer oder Artikel suchen...' : 'Search by order number or item...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400">
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Bestellnummer' : 'Order Number' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Lieferant' : 'Vendor' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Artikel' : 'Items' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Gesamtbetrag' : 'Total Amount' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Bestelldatum' : 'Order Date' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-slate-50 dark:hover:bg-slate-700">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ order.orderNumber }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">{{ order.category }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                    <Building class="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ order.vendorName }}</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">{{ order.vendorContact }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-800 dark:text-slate-50">{{ order.itemCount }} {{ language === 'de' ? 'Artikel' : 'items' }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">{{ order.description }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-800 dark:text-slate-50">€{{ order.totalAmount.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4">
                <span :class="getOrderStatusColor(order)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getOrderStatusTranslation(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-800 dark:text-slate-50">{{ formatDate(order.orderDate) }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">{{ order.expectedDelivery ? formatDate(order.expectedDelivery) : 'TBD' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex space-x-2">
                  <button @click="viewOrderDetails(order)" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="editOrder(order)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="trackOrder(order)" class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                    <Truck class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden p-4 space-y-4">
        <div v-for="order in filteredOrders" :key="order.id" class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ order.orderNumber }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ order.category }}</div>
            </div>
            <span :class="getOrderStatusColor(order)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
              {{ getOrderStatusTranslation(order.status) }}
            </span>
          </div>
          
          <div class="flex items-center mb-3">
            <div class="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
              <Building class="h-4 w-4 text-white" />
            </div>
            <div>
              <div class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ order.vendorName }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ order.vendorContact }}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Artikel' : 'Items' }}</div>
              <div class="text-sm text-slate-800 dark:text-slate-50">{{ order.itemCount }} {{ language === 'de' ? 'Artikel' : 'items' }}</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Gesamtbetrag' : 'Total' }}</div>
              <div class="text-sm font-medium text-slate-800 dark:text-slate-50">€{{ order.totalAmount.toLocaleString() }}</div>
            </div>
          </div>

          <div class="mb-3">
            <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Bestelldatum' : 'Order Date' }}</div>
            <div class="text-sm text-slate-800 dark:text-slate-50">{{ formatDate(order.orderDate) }}</div>
          </div>

          <div class="flex justify-end space-x-2">
            <button @click="viewOrderDetails(order)" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1">
              <Eye class="h-4 w-4" />
            </button>
            <button @click="editOrder(order)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-1">
              <Edit class="h-4 w-4" />
            </button>
            <button @click="trackOrder(order)" class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1">
              <Truck class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Order Modal -->
    <div v-if="showNewOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Neue Bestellung' : 'New Order' }}
          </h3>
          <button @click="showNewOrderModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="createNewOrder" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Lieferant' : 'Vendor' }}
              </label>
              <select v-model="newOrder.vendorId" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="">{{ language === 'de' ? 'Lieferant auswählen...' : 'Select vendor...' }}</option>
                <option v-for="vendor in vendors" :key="vendor.id" :value="vendor.id">{{ vendor.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Kategorie' : 'Category' }}
              </label>
              <select v-model="newOrder.category" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="">{{ language === 'de' ? 'Kategorie auswählen...' : 'Select category...' }}</option>
                <option value="books">{{ language === 'de' ? 'Bücher' : 'Books' }}</option>
                <option value="equipment">{{ language === 'de' ? 'Ausrüstung' : 'Equipment' }}</option>
                <option value="supplies">{{ language === 'de' ? 'Verbrauchsmaterial' : 'Supplies' }}</option>
                <option value="technology">{{ language === 'de' ? 'Technologie' : 'Technology' }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Beschreibung' : 'Description' }}
            </label>
            <textarea v-model="newOrder.description" required rows="3" :placeholder="language === 'de' ? 'Beschreibung der Bestellung...' : 'Order description...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Anzahl Artikel' : 'Number of Items' }}
              </label>
              <input v-model.number="newOrder.itemCount" type="number" min="1" required :placeholder="language === 'de' ? 'Anzahl...' : 'Count...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400">
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Geschätzter Gesamtbetrag' : 'Estimated Total Amount' }}
              </label>
              <input v-model.number="newOrder.totalAmount" type="number" min="0" step="0.01" required :placeholder="language === 'de' ? 'Betrag...' : 'Amount...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Erwartetes Lieferdatum' : 'Expected Delivery Date' }}
            </label>
            <input v-model="newOrder.expectedDelivery" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Notizen' : 'Notes' }}
            </label>
            <textarea v-model="newOrder.notes" rows="3" :placeholder="language === 'de' ? 'Zusätzliche Notizen...' : 'Additional notes...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400"></textarea>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showNewOrderModal = false" class="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button type="submit" class="px-4 py-2 bg-gradient-to-r from-indigo-700 to-blue-600 text-white rounded-lg hover:from-indigo-800 hover:to-blue-700">
              {{ language === 'de' ? 'Bestellung erstellen' : 'Create Order' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguageStore } from '../../stores/language'
import {
  Package, ChevronRight, Filter, Download, Plus, Eye, Edit, Truck, X,
  Building, ShoppingCart, Clock, CheckCircle, AlertCircle, DollarSign
} from 'lucide-vue-next'

const languageStore = useLanguageStore()
const language = computed(() => languageStore.language)

// Reactive data
const showFilters = ref(false)
const showNewOrderModal = ref(false)

const filters = ref({
  status: '',
  vendor: '',
  category: '',
  search: ''
})

const newOrder = ref({
  vendorId: '',
  category: '',
  description: '',
  itemCount: null,
  totalAmount: null,
  expectedDelivery: '',
  notes: ''
})

// Mock data
const orders = ref([
  {
    id: 1,
    orderNumber: 'PO-2024-001',
    vendorId: 1,
    vendorName: 'Academic Book Supply Co.',
    vendorContact: 'orders@bookssupply.com',
    category: 'books',
    description: 'Mathematics textbooks for Grade 10',
    itemCount: 50,
    totalAmount: 2500,
    status: 'delivered',
    orderDate: '2024-01-10',
    expectedDelivery: '2024-01-20',
    actualDelivery: '2024-01-18',
    trackingNumber: 'TRK123456789',
    notes: 'Priority delivery requested'
  },
  {
    id: 2,
    orderNumber: 'PO-2024-002',
    vendorId: 2,
    vendorName: 'Scientific Equipment Ltd.',
    vendorContact: 'sales@sciequip.com',
    category: 'equipment',
    description: 'Laboratory microscopes and accessories',
    itemCount: 12,
    totalAmount: 8500,
    status: 'ordered',
    orderDate: '2024-01-12',
    expectedDelivery: '2024-01-25',
    actualDelivery: null,
    trackingNumber: 'TRK987654321',
    notes: 'Requires installation service'
  },
  {
    id: 3,
    orderNumber: 'PO-2024-003',
    vendorId: 3,
    vendorName: 'Office Supplies Plus',
    vendorContact: 'info@officesupplies.com',
    category: 'supplies',
    description: 'Stationery and office supplies',
    itemCount: 200,
    totalAmount: 750,
    status: 'approved',
    orderDate: '2024-01-14',
    expectedDelivery: '2024-01-22',
    actualDelivery: null,
    trackingNumber: null,
    notes: 'Bulk order for quarterly stock'
  },
  {
    id: 4,
    orderNumber: 'PO-2024-004',
    vendorId: 4,
    vendorName: 'TechEd Solutions',
    vendorContact: 'orders@techedsolutions.com',
    category: 'technology',
    description: 'Tablets for digital learning initiative',
    itemCount: 30,
    totalAmount: 15000,
    status: 'pending',
    orderDate: '2024-01-15',
    expectedDelivery: '2024-01-30',
    actualDelivery: null,
    trackingNumber: null,
    notes: 'Waiting for budget approval'
  }
])

const vendors = ref([
  { id: 1, name: 'Academic Book Supply Co.', contact: 'orders@bookssupply.com', category: 'books' },
  { id: 2, name: 'Scientific Equipment Ltd.', contact: 'sales@sciequip.com', category: 'equipment' },
  { id: 3, name: 'Office Supplies Plus', contact: 'info@officesupplies.com', category: 'supplies' },
  { id: 4, name: 'TechEd Solutions', contact: 'orders@techedsolutions.com', category: 'technology' },
  { id: 5, name: 'Educational Resources Inc.', contact: 'sales@eduresources.com', category: 'books' }
])

// Computed properties
const orderStats = computed(() => [
  {
    title: language.value === 'de' ? 'Gesamtbestellungen' : 'Total Orders',
    value: orders.value.length.toString(),
    change: language.value === 'de' ? '+8 diesen Monat' : '+8 this month',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: ShoppingCart,
    iconBg: 'bg-blue-500'
  },
  {
    title: language.value === 'de' ? 'Ausstehende Genehmigungen' : 'Pending Approval',
    value: orders.value.filter(o => o.status === 'pending').length.toString(),
    change: language.value === 'de' ? 'Benötigen Bearbeitung' : 'Need processing',
    changeColor: 'text-yellow-600 dark:text-yellow-400',
    icon: Clock,
    iconBg: 'bg-yellow-500'
  },
  {
    title: language.value === 'de' ? 'Geliefert' : 'Delivered',
    value: orders.value.filter(o => o.status === 'delivered').length.toString(),
    change: language.value === 'de' ? '95% Erfolgsrate' : '95% success rate',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: CheckCircle,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Gesamtwert' : 'Total Value',
    value: `€${orders.value.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`,
    change: language.value === 'de' ? '+15% vom Vormonat' : '+15% from last month',
    changeColor: 'text-blue-600 dark:text-blue-400',
    icon: DollarSign,
    iconBg: 'bg-purple-500'
  }
])

const filteredOrders = computed(() => {
  let filtered = orders.value

  if (filters.value.status) {
    filtered = filtered.filter(o => o.status === filters.value.status)
  }

  if (filters.value.vendor) {
    filtered = filtered.filter(o => o.vendorId === parseInt(filters.value.vendor))
  }

  if (filters.value.category) {
    filtered = filtered.filter(o => o.category === filters.value.category)
  }

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(o => 
      o.orderNumber.toLowerCase().includes(searchTerm) ||
      o.description.toLowerCase().includes(searchTerm) ||
      o.vendorName.toLowerCase().includes(searchTerm)
    )
  }

  return filtered
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US')
}

const getOrderStatusColor = (order: any) => {
  switch (order.status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'approved':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'ordered':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getOrderStatusTranslation = (status: string) => {
  const translations = {
    pending: language.value === 'de' ? 'Ausstehend' : 'Pending',
    approved: language.value === 'de' ? 'Genehmigt' : 'Approved',
    ordered: language.value === 'de' ? 'Bestellt' : 'Ordered',
    delivered: language.value === 'de' ? 'Geliefert' : 'Delivered',
    cancelled: language.value === 'de' ? 'Storniert' : 'Cancelled'
  }
  return translations[status as keyof typeof translations] || status
}

const viewOrderDetails = (order: any) => {
  console.log('View order details:', order)
}

const editOrder = (order: any) => {
  console.log('Edit order:', order)
}

const trackOrder = (order: any) => {
  if (order.trackingNumber) {
    alert(`${language.value === 'de' ? 'Tracking-Nummer' : 'Tracking Number'}: ${order.trackingNumber}`)
  } else {
    alert(language.value === 'de' ? 'Keine Tracking-Nummer verfügbar' : 'No tracking number available')
  }
}

const createNewOrder = () => {
  const selectedVendor = vendors.value.find(v => v.id === parseInt(newOrder.value.vendorId))
  
  const order = {
    id: orders.value.length + 1,
    orderNumber: `PO-2024-${String(orders.value.length + 1).padStart(3, '0')}`,
    vendorId: parseInt(newOrder.value.vendorId),
    vendorName: selectedVendor?.name || '',
    vendorContact: selectedVendor?.contact || '',
    category: newOrder.value.category,
    description: newOrder.value.description,
    itemCount: newOrder.value.itemCount,
    totalAmount: newOrder.value.totalAmount,
    status: 'pending',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: newOrder.value.expectedDelivery,
    actualDelivery: null,
    trackingNumber: null,
    notes: newOrder.value.notes
  }
  
  orders.value.push(order)
  showNewOrderModal.value = false
  
  // Reset form
  newOrder.value = {
    vendorId: '',
    category: '',
    description: '',
    itemCount: null,
    totalAmount: null,
    expectedDelivery: '',
    notes: ''
  }
}

const exportOrders = () => {
  console.log('Exporting orders...')
  alert(language.value === 'de' ? 'Bestellungen werden exportiert...' : 'Exporting orders...')
}
</script> 